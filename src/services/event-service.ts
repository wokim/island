const cls = require('continuation-local-storage');
import * as _ from 'lodash';
import * as Promise from 'bluebird';
import * as amqp from 'amqplib';
import * as uuid from 'node-uuid';
import { logger } from '../utils/logger';
import { AmqpChannelPoolService } from './amqp-channel-pool-service';
import { Message, Event, EventHandler, Subscriber, EventSubscriber, PatternSubscriber } from './event-subscriber';
import reviver from '../utils/reviver';

function enterScope(properties: any, func): Promise<any> {
  return new Promise((resolve, reject) => {
    const ns = cls.getNamespace('app');
    ns.run(() => {
      _.each(properties, (value, key) => {
        ns.set(key, value);
      });
      Promise.try(func).then(resolve).catch(reject);
    });
  });
}

export class EventService {
  private static EXCHANGE_NAME: string = 'MESSAGE_BROKER_EXCHANGE';
  private channelPool: AmqpChannelPoolService;
  private roundRobinQ: string;
  private fanoutQ: string;
  private subscribers: Subscriber[] = [];
  private serviceName: string;
  constructor(serviceName: string) {
    this.serviceName = serviceName; 
    this.roundRobinQ = `event.${serviceName}`;
    this.fanoutQ = `event.${serviceName}.node.${uuid.v4()}`;
  }

  initialize(channelPool: AmqpChannelPoolService): Promise<any> {
    this.channelPool = channelPool;
    return channelPool.usingChannel(channel => {
      return channel.assertExchange(EventService.EXCHANGE_NAME, 'topic', {durable: true})
        .then(() => channel.assertQueue(this.roundRobinQ, {durable: true, exclusive: false}))
        .then(() => channel.assertQueue(this.fanoutQ, {exclusive: true, autoDelete: true}));
    });
  }

  startConsume(): Promise<any> {
    return this.channelPool.acquireChannel()
      .then(channel => {
        return Promise.map([this.roundRobinQ, this.fanoutQ], queue => {
          return this.registerConsumer(channel, queue);
        });
      });
  }

  private registerConsumer(channel: amqp.Channel, queue: string): Promise<any> {
    return Promise.resolve(channel.consume(queue, msg => {
      if (!msg) {
        logger.error(`consume was canceled unexpectedly`);
        //todo: handle unexpected cancel
        return;
      }
      this.handleMessage(msg)
        .catch(e => {
          logger.error(`error on handling event: ${e}`);
          //todo: define island error and publish log.eventError
        })
        .finally(() => {
          channel.ack(msg);
          //todo: fix me. we're doing ACK always even if promise rejected.
          //todo: how can we handle the case subscribers succeeds or fails partially
        });
    }));
    //todo: save channel and consumer tag
  }

  private handleMessage(msg: Message): Promise<any> {
    const headers = msg.properties.headers;
    const tattoo = headers && headers.tattoo;
    const content = JSON.parse(msg.content.toString('utf8'), reviver);
    logger.debug(`${msg.fields.routingKey}`, content, msg.properties.headers);
    const subscribers = this.subscribers.filter(subscriber => subscriber.isRoutingKeyMatched(msg.fields.routingKey));
    return Promise.map(subscribers, subscriber => {
      return enterScope({RequestTrackId: tattoo, Context: msg.fields.routingKey, Type: 'event'}, () => {
        const visualizeLog: any = {
          tattoo,
          ts: {
            c: msg.properties.timestamp,
            r: +(new Date())
          },
          size: msg.content.byteLength,
          from: headers.from,
          to: {
              node: process.env.HOSTNAME,
              context: msg.fields.routingKey,
              island: this.serviceName,
              type: 'event'
          }
        };
        return subscriber.handleEvent(content, msg)
          .then(() => {
            visualizeLog.ts.e = +(new Date());
            visualizeLog.error = false;
            logger.debug(JSON.stringify(visualizeLog, null, 4));
          })
          .catch(e => {
            visualizeLog.ts.e = +(new Date());
            visualizeLog.error = true;
          })
      });
    });
  }

  purge(): Promise<any> {
    //todo: cancel consume
    return Promise.resolve();
  }

  subscribeEvent<T extends Event<U>, U>(eventClass: new (args: U) => T,
                                        handler: EventHandler<T>,
                                        options?: SubscriptionOptions): Promise<void> {
    return Promise.try(() => new EventSubscriber(handler, eventClass))
      .then(subscriber => this.subscribe(subscriber, options));
  }

  subscribePattern(pattern: string,
                   handler: EventHandler<Event<any>>,
                   options?: SubscriptionOptions): Promise<void> {
    const ns = cls.getNamespace('app');
    return Promise.try(() => new PatternSubscriber(handler, pattern))
      .then(subscriber => this.subscribe(subscriber, options));
  }

  private subscribe(subscriber: Subscriber, options: SubscriptionOptions): Promise<void> {
    options = options || {};
    let queue = options.everyNodeListen && this.fanoutQ || this.roundRobinQ;
    return this.channelPool.usingChannel(channel => {
        return channel.bindQueue(queue, EventService.EXCHANGE_NAME, subscriber.getRoutingPattern());
      })
      .then(() => {
        this.subscribers.push(subscriber);
      });
  }

  //todo: implement unsubscribe

  publishEvent<T extends Event<U>, U>(event: T): Promise<any> {
    const ns = cls.getNamespace('app');
    const tattoo = ns.get('RequestTrackId');
    const context = ns.get('Context');
    const type = ns.get('Type');
    logger.debug(`publish ${event.key}`, event.args, tattoo);
    return Promise.try(() => new Buffer(JSON.stringify(event.args), 'utf8'))
      .then(content => {
        return this.channelPool.usingChannel(channel => {
          const headers = {
            tattoo,
            from: { node: process.env.HOSTNAME, context, island: this.serviceName, type }
          };
          const options = {
            timestamp: +new Date(),
            headers
          }
          return Promise.resolve(channel.publish(EventService.EXCHANGE_NAME, event.key, content, options));
        });
      });
  }
}

export interface SubscriptionOptions {
  everyNodeListen?: boolean;
}


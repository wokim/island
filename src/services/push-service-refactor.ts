'use strict';

import * as amqp from 'amqplib';
import * as Promise from 'bluebird';
import MessagePack from '../utils/msgpack';
import {IConsumerInfo} from './abstract-broker-service';
import _debug = require('debug');

let debug = _debug('ISLAND:SERVICES:PUSH');

export default class PushService {
  private static PUSH_FANOUT_EXCHANGE: string = 'PUSH_FANOUT_EXCHANGE';
  private static UNICAST_EXCHANGE_OPTIONS: any = {
    durable: true,
    autoDelete: true
  };

  private static DEFAULT_EXCHANGE_OPTIONS: any = {
    durable: true,
    autoDelete: true
  };

  private static SESSION_Q_OPTIONS: any = {
    durable: true,
    // todo: apply [Queue-TTL](http://www.rabbitmq.com/ttl.html#queue-ttl)
  };

  private msgpack: MessagePack;

  constructor(private connection: amqp.Connection) {
    this.msgpack = MessagePack.getInst();
  }

  private getChannelDisposer(): Promise.Disposer<amqp.Channel> {
    let errorOccured = false;
    return Promise.resolve(this.connection.createChannel())
      .then(channel => {
        channel.on('error', err => {
          console.log('channel error:', err);
          err.stack && console.log(err.stack);
          errorOccured = true;
        });
        return channel;
      })
      .disposer(channel => {
        if (!errorOccured) channel.close();
      });
  }

  initialize() {
    return Promise.using(this.getChannelDisposer(), channel => {
      return channel.assertExchange(PushService.PUSH_FANOUT_EXCHANGE, 'fanout', {durable: true});
    });
  }

  purge() {
    return Promise.using(this.getChannelDisposer(), channel => {
      channel.deleteExchange(PushService.PUSH_FANOUT_EXCHANGE, {ifUnused: true, ifEmpty: true});
    });
  }

  bindAccount(sid: string, aid: string) {
    return Promise.using(this.getChannelDisposer(), channel => {
      return Promise.all([
          channel.assertQueue(sessionQ(sid), PushService.SESSION_Q_OPTIONS),
          channel.assertExchange(aid, 'direct', PushService.UNICAST_EXCHANGE_OPTIONS),
          channel.assertExchange(PushService.PUSH_FANOUT_EXCHANGE, 'fanout', {durable: true})
        ])
        .then(() => {
          return Promise.all([
            channel.bindQueue(sessionQ(sid), aid, ''),
            channel.bindExchange(aid, PushService.PUSH_FANOUT_EXCHANGE, '', {})
          ]);
        });
    });
  }

  unbindAccount(sid: string, aid: string) {
    return Promise.using(this.getChannelDisposer(), channel => {
      return Promise.all([
        channel.deleteExchange(aid),
        channel.deleteQueue(sessionQ(sid))
      ]);
    });
  }

  bindPlayer(sid: string, pid: string) {
    return Promise.using(this.getChannelDisposer(), channel => {
      return channel.assertExchange(pid, 'direct', PushService.UNICAST_EXCHANGE_OPTIONS)
        .then(() => channel.bindQueue(sessionQ(sid), pid, ''));
    });
  }

  unbindPlayer(sid: string, pid: string) {
    return Promise.using(this.getChannelDisposer(), channel => {
      return channel.deleteExchange(pid);
    });
  }

  bindExchange(destination: string, source: string, pattern?: string, sourceType?: string, sourceOpts?: any) {
    debug(`bind exchanges. (source:${source}) => destination:${destination}`);
    return Promise.using(this.getChannelDisposer(), channel => {
      return channel.assertExchange(source, sourceType || 'fanout', sourceOpts || PushService.DEFAULT_EXCHANGE_OPTIONS)
        .then(() => channel.bindExchange(destination, source, pattern || '', {}));
    });
  }

  unbindExchange(destination: string, source: string, pattern?: string) {
    return Promise.using(this.getChannelDisposer(), channel => {
      return channel.unbindExchange(destination, source, pattern || '', {});
    });
  }

  unicast(exchange: string, msg: any, options?: any) {
    return Promise.using(this.getChannelDisposer(), channel => {
      return channel.publish(exchange, '', this.msgpack.encode(msg), options);
    });
  }

  multicast(exchange: string, msg: any, routingKey?: string, options?: any) {
    return Promise.using(this.getChannelDisposer(), channel => {
      return channel.publish(exchange, routingKey || '', this.msgpack.encode(msg), options);
    });
  }

  broadcast(msg: any, options?: any) {
    return Promise.using(this.getChannelDisposer(), channel => {
      return channel.assertExchange(PushService.PUSH_FANOUT_EXCHANGE, 'fanout', {durable: true})
        .then(() => channel.publish(PushService.PUSH_FANOUT_EXCHANGE, '', this.msgpack.encode(msg), options));
    });
  }

  consume(sid: string, handler: (msg: any, decodedContent: any) => void, options?: any): Promise<IConsumerInfo> {
    return Promise.resolve(this.connection.createChannel())
      .then(channel => {
        return channel.assertQueue(sessionQ(sid), PushService.SESSION_Q_OPTIONS)
          .then(() => {
            return channel.consume(sessionQ(sid), msg => {
              if (msg) {
                handler(msg, this.msgpack.decode(msg.content));
                channel.ack(msg);
              } else {
                console.log(`consumer was cancelled unexpectedly. queue=${sessionQ}`);
              }
            }, options || {});
          })
          .then(result => {
            return {
              channel: channel,
              tag: (result || {}).consumerTag
            };
          });
      });
  }

  cancel(consumerInfo: IConsumerInfo) {
    return Promise.try(() => {
      if (!consumerInfo) throw new Error('tag is undefined');
      return consumerInfo.channel.cancel(consumerInfo.tag);
    })
      .then(() => consumerInfo.channel.close());
  }
}

// Queue name = session.<sid>
function sessionQ(sid: string): string {
  return `session.${sid}`;
}

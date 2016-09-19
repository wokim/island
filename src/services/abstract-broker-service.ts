import * as amqp from 'amqplib';
import * as Promise from 'bluebird';
import MessagePack from '../utils/msgpack';
import { LogicError, FatalError, ISLAND } from '../utils/error';

export interface IConsumerInfo {
  channel: amqp.Channel;
  tag: string;
}

export default class AbstractBrokerService {
  protected msgpack: MessagePack;
  protected initialized: boolean;

  public constructor(protected connection: amqp.Connection, protected options: { rpcTimeout?: number, serviceName?: string } = {}) {
    this.msgpack = MessagePack.getInst();
  }

  public initialize() {
    return Promise.reject(new FatalError(ISLAND.FATAL.F0011_NOT_INITIALIZED_EXCEPTION, 'Not initialized exception'));
  }

  private getChannel() {
    return Promise.resolve(this.connection.createChannel());
  }

  private call(handler: (channel: amqp.Channel) => any, ignoreClosingChannel?: boolean) {
    return this.getChannel().then(channel => {
      channel.on('error', err => {
        console.log('channel error:', err);
        err.stack && console.log(err.stack);
      });
      return Promise.resolve(handler(channel))
        .then(ok => {
          if (!ignoreClosingChannel) channel.close();
          return ok;
        });
    });
  }

  protected declareExchange(name: string, type: string, options: amqp.Options.AssertExchange): Promise<amqp.Replies.AssertExchange> {
    return this.call((channel: amqp.Channel) => channel.assertExchange(name, type, options));
  }

  protected deleteExchage(name: string, options?: amqp.Options.DeleteExchange): Promise<amqp.Replies.Empty> {
    return this.call((channel: amqp.Channel) => channel.deleteExchange(name, options));
  }

  protected declareQueue(name: string, options: amqp.Options.AssertQueue): Promise<amqp.Replies.AssertQueue> {
    return this.call((channel: amqp.Channel) => channel.assertQueue(name, options));
  }

  protected deleteQueue(name: string, options?: amqp.Options.DeleteQueue): Promise<amqp.Replies.DeleteQueue> {
    return this.call((channel: amqp.Channel) => channel.deleteQueue(name, options));
  }

  protected bindQueue(queue: string, source: string, pattern?: string, args?: any): Promise<amqp.Replies.Empty> {
    return this.call((channel: amqp.Channel) => channel.bindQueue(queue, source, pattern || '', args));
  }

  protected unbindQueue(queue: string, source: string, pattern?: string, args?: any): Promise<amqp.Replies.Empty> {
    return this.call((channel: amqp.Channel) => channel.unbindQueue(queue, source, pattern || '', args));
  }

  protected sendToQueue(queue: string, content: any, options?: any): Promise<boolean> {
    return this.call((channel: amqp.Channel) => channel.sendToQueue(queue, content, options));
  }

  protected ack(message: any, allUpTo?: any) {
    return this.call((channel: amqp.Channel) => channel.ack(message, allUpTo));
  }

  protected _consume(key: string, handler: (msg) => Promise<any>, tag: string, options?: any): Promise<IConsumerInfo> {
    let f = (message) => {
      return String.fromCharCode(0x1b) + '[32m' + message + String.fromCharCode(0x1b) + '[0m';
    };

    return this.call((channel: amqp.Channel) => {
      const myHandler = msg => {
        handler(msg).then(() => {
          channel.ack(msg);
        })
          .catch((error: Error) => {
            if (error['type'] && parseInt(error['type']) === 503) {
            setTimeout(() => {
              channel.nack(msg);
            }, 1000);
            return;
            }
            throw error;
          });
        // if (!(options && options.noAck)) {
        //   channel.ack(msg);  // delivery-tag 가 channel 내에서만 유효하기 때문에 여기서 해야됨.
        // }
      };
      return channel.consume(key, myHandler, options || {})
        .then(result => ({channel, tag: result.consumerTag}));
    }, true);
  }

  protected _cancel(consumerInfo: IConsumerInfo): Promise<amqp.Replies.Empty> {
    return Promise.resolve(consumerInfo.channel.cancel(consumerInfo.tag))
      .then((ok) => {
        return consumerInfo.channel.close().then(() => ok);
      });
  }

  protected _publish(exchange: any, routingKey: any, content: any, options?: any) {
    return this.call((channel: amqp.Channel) => channel.publish(exchange, routingKey, content, options));
  }
}

import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');
import MessagePack from '../utils/msgpack';

export interface IConsumerInfo {
  channel: amqp.Channel;
  tag: string;
}

export default class AbstractBrokerService {
  protected msgpack: MessagePack;
  protected initialized: boolean;

  public constructor(protected connection: amqp.Connection, protected options: { rpcTimeout?: number } = {}) {
    this.msgpack = MessagePack.getInst();
  }

  public initialize() {
    return Promise.reject(new Error('Not initialized exception'));
  }

  private getChannel() {
    var deferred = Promise.defer<amqp.Channel>();
    this.connection.createChannel((err, channel) => {
      if (err) return deferred.reject(err);
      return deferred.resolve(channel);
    });
    return deferred.promise;
  }

  private call(handler: (channel: amqp.Channel, callback: (err: Error, ok: any) => void) => void, ignoreClosingChannel?: boolean) {
    return this.getChannel().then(channel => {
      channel.on('error', err => {
        console.log('channel error:', err);
        err.stack && console.log(err.stack);
      });
      var deferred = Promise.defer<any>();
      // TODO: promise 로 전환할 것
      handler(channel, (err, ok) => {
        if (err) return deferred.reject(err);
        deferred.resolve(ok);
        if (!ignoreClosingChannel) channel.close();
      });
      return deferred.promise;
    });
  }

  protected declareExchange(name: string, type: string, options: amqp.ExchangeOptions) {
    return this.call((channel: amqp.Channel, callback) => channel.assertExchange(name, type, options, callback));
  }

  protected deleteExchage(name: string, options?: amqp.DeleteOptions) {
    return this.call((channel: amqp.Channel, callback) => channel.deleteExchange(name, options, callback));
  }

  protected declareQueue(name: string, options: amqp.AssertOptions) {
    return this.call((channel: amqp.Channel, callback) => channel.assertQueue(name, options, callback));
  }

  protected deleteQueue(name: string, options?: amqp.DeleteOptions) {
    return this.call((channel: amqp.Channel, callback) => {
      channel.deleteQueue(name, options, callback);
    });
  }

  protected bindQueue(queue: string, source: string, pattern?: string, args?: any) {
    return this.call((channel: amqp.Channel, callback) => {
      channel.bindQueue(queue, source, pattern || '', args, callback);
    });
  }

  protected unbindQueue(queue: string, source: string, pattern?: string, args?: any) {
    return this.call((channel: amqp.Channel, callback) => {
      channel.unbindQueue(queue, source, pattern || '', args, callback);
    });
  }

  protected sendToQueue(queue: string, content: any, options?: any) {
    return this.call((channel: amqp.Channel, callback) => {
      callback(null, channel.sendToQueue(queue, content, options));
    });
  }

  protected ack(message: any, allUpTo?: any) {
    return this.call((channel: amqp.Channel, callback) => {
      callback(null, channel.ack(message, allUpTo));
    });
  }

  protected _consume(key: string, handler: (msg) => void, options?: any): Promise<IConsumerInfo> {
    return this.call((channel: amqp.Channel, callback) => {
      channel.consume(key, msg => {
        handler(msg);
        if (!(options && options.noAck)) {
          channel.ack(msg);  // delivery-tag 가 channel 내에서만 유효하기 때문에 여기서 해야됨.
        }
      }, options || {}, (err, result) => {
        callback(err, { channel: channel, tag: (result || {}).consumerTag });
      });
    }, true);
  }

  protected _cancel(consumerInfo: IConsumerInfo) {
    var deferred = Promise.defer<any>();
    consumerInfo.channel.cancel(consumerInfo.tag, (err, ok) => {
      if (err) return deferred.reject(err);
      consumerInfo.channel.close(() => {
        deferred.resolve(ok);
      });
    });
    return deferred.promise;
  }

  protected _publish(exchange: any, routingKey: any, content: any, options?: any) {
    return this.call((channel: amqp.Channel, callback) => {
      callback(null, channel.publish(exchange, routingKey, content, options));
    });
  }
}

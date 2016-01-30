import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');
import _ = require('lodash');
import AbstractBrokerService, { IConsumerInfo } from './abstract-broker-service';

export default class MessageBrokerService extends AbstractBrokerService {
  private static EXCHANGE_NAME: string = 'MESSAGE_BROKER_EXCHANGE';
  private serviceName: string;
  private consumerInfo: IConsumerInfo;
  private handlers: {[pattern: string]: (msg: any, routingKey: string) => void};

  public constructor(connection: amqp.Connection, serviceName: string) {
    this.serviceName = serviceName;
    this.handlers = {};
    super(connection);
  }

  public initialize() {
    if (this.initialized) return Promise.resolve();
    if (!this.serviceName) return Promise.reject(new Error('serviceName is not defined'));

    return this.declareExchange(MessageBrokerService.EXCHANGE_NAME, 'topic', { durable: true }).then(() => {
      return this.declareQueue(this.serviceName, { durable: true, exclusive: false });
    }).then(() => {
      this.initialized = true;
      return this.consume(this.onMessage.bind(this));
    }).then(consumerInfo => {
      this.consumerInfo = consumerInfo;
    });
  }

  public purge() {
    return this.cancel(this.consumerInfo).then(() => {
      this.consumerInfo = undefined;
      this.initialized = false;
    });
  }

  private onMessage(msg: any, routingKey: string) {
    _.keys(this.handlers).forEach(pattern => {
      var matcher = this.matcher(pattern);
      if (matcher.test(routingKey)) this.handlers[pattern](msg, routingKey);
    });
  }

  private matcher(pattern: string) {
    var splits = pattern.split('.');
    return new RegExp(splits.map(s => {
      return s === '*' ? '[a-zA-Z0-9]*' : (s === '#' ? '[a-zA-Z0-9.]' : s);
    }).join('.'));
  }

  public subscribe(pattern: string, handler?: (msg: any) => void) {
    if (!this.initialized) return Promise.reject(new Error('Not initialized'));
    return this.bindQueue(this.serviceName, MessageBrokerService.EXCHANGE_NAME, pattern).then(result => {
      if (handler) this.handlers[pattern] = handler;
      return result;
    });
  }

  public unsubscribe(pattern: string) {
    if (!this.initialized) return Promise.reject(new Error('Not initialized'));
    return this.unbindQueue(this.serviceName, MessageBrokerService.EXCHANGE_NAME, pattern).then(result => {
      delete this.handlers[pattern];
      return result;
    });
  }

  public publish(key: string, msg: any) {
    if (!this.initialized) return Promise.reject(new Error('Not initialized'));
    return this._publish(MessageBrokerService.EXCHANGE_NAME, key, this.msgpack.encode(msg))
  }

  private consume(handler: (msg: any, routingKey: string) => void, options?: any) {
    if (!this.initialized) return Promise.reject<IConsumerInfo>(new Error('Not initialized'));
    return this._consume(this.serviceName, msg => {
      let decodedParams;
      try {
        decodedParams = this.msgpack.decode(msg.content);
        handler(decodedParams, msg.fields.routingKey);
      } catch (e) {
        this.publish('log.eventError', {
          event: msg.fields.routingKey,
          params: decodedParams || null,
          error: e
        });
      }
    }, options);
  }

  private cancel(consumer: IConsumerInfo) {
   if (!consumer) return Promise.reject(new Error('Tag is undefined'));
   if (!this.initialized) return Promise.reject(new Error('Not initialized'));
   return this._cancel(consumer);
  }
}

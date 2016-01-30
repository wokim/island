import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');
import AbstractBrokerService, { IConsumerInfo } from './abstract-broker-service';

export default class PushService extends AbstractBrokerService {
  private static TOPIC_EXCHANGE_NAME: string = 'PUSH_TOPIC_EXCHANGE';
  private static FANOUT_EXCHANGE_NAME: string = 'PUSH_FANOUT_EXCHANGE';

  public initialize() {
    if (this.initialized) return Promise.resolve();
    var promises = [this.declareExchange(PushService.TOPIC_EXCHANGE_NAME, 'topic', { durable: true }),
                    this.declareExchange(PushService.FANOUT_EXCHANGE_NAME, 'fanout', { durable: true })];
    return Promise.all(promises).then(() => { this.initialized = true; });
  }

  public purge() {
    var promises = [this.deleteExchage(PushService.TOPIC_EXCHANGE_NAME, { ifUnused: true, ifEmpty: true }),
                    this.deleteExchage(PushService.FANOUT_EXCHANGE_NAME,  { ifUnused: true, ifEmpty: true })];
    return Promise.all(promises).then(() => {
      this.initialized = false;
    });
  }

  public auth(sid: string, aid: string) {
    if (!this.initialized) return Promise.reject(new Error('Not initialized'));
    return this.declareQueue(sid, { durable: true }).then(() => {
      var promises = [this.bindQueue(sid, PushService.TOPIC_EXCHANGE_NAME, aid),
                      this.bindQueue(sid, PushService.FANOUT_EXCHANGE_NAME)];
      return Promise.all(promises).then(() => this.initialized = true);
    });
  }

  public unauth(sid: string, aid: string) {
    if (!this.initialized) return Promise.reject(new Error('Not initialized'));
    return Promise.all([this.unbindQueue(sid, PushService.TOPIC_EXCHANGE_NAME, aid),
                        this.unbindQueue(sid, PushService.FANOUT_EXCHANGE_NAME)]).then(() => {
        return this.deleteQueue(sid, { ifUnused: true });
    });
  }

  public login(sid: string, pid: string) {
    return this.subscribe(sid, pid);
  }

  public logout(sid: string, pid: string) {
    return this.unsubscribe(sid, pid);
  }

  public subscribe(sid: string, pattern: string) {
    if (!this.initialized) return Promise.reject(new Error('Not initialized'));
    return this.bindQueue(sid, PushService.TOPIC_EXCHANGE_NAME, pattern);
  }

  public unsubscribe(sid: string, pattern: string) {
    if (!this.initialized) return Promise.reject(new Error('Not initialized'));
    return this.unbindQueue(sid, PushService.TOPIC_EXCHANGE_NAME, pattern);
  }

  public publish(key: number, msg: any);
  public publish(key: string, msg: any);
  public publish(key: any, msg: any) {
    if (!this.initialized) return Promise.reject(new Error('Not initialized'));
    if (typeof key === 'number') key = key.toString();
    return this._publish(PushService.TOPIC_EXCHANGE_NAME, key, this.msgpack.encode(msg));
  }

  public broadcast(msg: any) {
    if (!this.initialized) return Promise.reject(new Error('Not initialized'));
    return this._publish(PushService.FANOUT_EXCHANGE_NAME, '', this.msgpack.encode(msg));
  }

  public consume(key: string, handler: (msg: any, routingKey: string) => void, options?: any) {
    if (!this.initialized) return Promise.reject<IConsumerInfo>(new Error('Not initialized'));
    return this._consume(key, msg => { handler(this.msgpack.decode(msg.content), msg.fields.routingKey); }, options);
  }

  public cancel(consumer: IConsumerInfo) {
    if (!consumer) return Promise.reject(new Error('Tag is undefined'));
    if (!this.initialized) return Promise.reject<string>(new Error('Not initialized'));
    return this._cancel(consumer);
  }
}

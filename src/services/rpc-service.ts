import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');
import uuid = require('node-uuid');
import _debug = require('debug');
import * as _ from 'lodash';
import AbstractBrokerService, { IConsumerInfo } from './abstract-broker-service';
var debug = _debug('ISLAND:SERVICES:RPC');

interface MessageProperties {
  correlationId: string;
  replyTo?: string;
}

interface Message {
  content: Buffer;
  properties: MessageProperties;
}

export default class RPCService extends AbstractBrokerService {
  private consumerInfosMap: { [name: string]: IConsumerInfo } = {};

  public initialize() { return Promise.resolve(); }
  public purge()      {
    return Promise.reduce(_.keys(this.consumerInfosMap), (total, name) => this.unregister(name));
  }

  private replaceUndefined(obj: any) {
    for (var k in obj) {
      if (obj[k] === undefined)  {
        obj[k] = 'undefined';
      } else if (typeof obj[k] === 'object') {
        this.replaceUndefined(obj[k]);
      }
    }
  }

  public register(name: string, handler: (msg: any) => Promise<any>) {
    // NOTE: 컨슈머가 0개 이상에서 0개가 될 때 자동으로 삭제된다.
    // 단 한번도 컨슈머가 등록되지 않는다면 영원히 삭제되지 않는데 그런 케이스는 없음
    return this.declareQueue(name, { durable: false, autoDelete: true }).then(() => {
      return this._consume(name, (msg: Message) => {
        // NOTE: handler 에서 발생한 예외는 RPC 실패로 반환한다.
        let req;
        Promise.try(() => {
          let options: MessageProperties = {
            correlationId: msg.properties.correlationId
          };
          return Promise.try(() => {
            // NOTE: handler 가 es6 Promise를 던지는 경우가 발견되었다.
            // es6 promise는 timeout 이 없으므로 bluebird promise로 변환하고
            // handler 자체가 완벽한 promise가 아니라 exception 을 throw 할 수 있어서
            // Promise.try로 감싼다
            req = this.msgpack.decode(msg.content);
            return Promise.resolve(handler(req));
          }).then(value => {
            // HACK: Promise<void> 같은 타입 처리
            if (value === undefined) {
              value = 'undefined';
            } else if (typeof value === 'object') {
              this.replaceUndefined(value);
            }
            return this.sendToQueue(msg.properties.replyTo, this.msgpack.encode(value), options);
          }).timeout(this.options.rpcTimeout || 10000).catch(err => {
            // RPC 이름을 에러에 추가적으로 기록
            err.extra = {
              name: name,
              req: req
            };
            return this.sendToQueue(msg.properties.replyTo, this.msgpack.encode(err), options);
          });
        });
      }).then(consumerInfo => this.consumerInfosMap[name] = consumerInfo);
    });
  }

  public unregister(name: string) {
    var consumerInfo = this.consumerInfosMap[name];
    debug('consumerInfo: %o', consumerInfo.tag);
    if (!consumerInfo) return Promise.resolve();
    return this._cancel(consumerInfo)
      .then(ok => {
        delete this.consumerInfosMap[name];
        return ok;
      });
  }

  public invoke<T, U>(name: string, msg: T): Promise<U>;
  public invoke(name: string, msg: any);
  public invoke(name: string, msg: any) {
    var deferred = Promise.defer<any>();
    var corrId = uuid.v4();
    var consumerInfo: IConsumerInfo;
    this.declareQueue('', { exclusive: true }).then(res => {
      var queue = res.queue;
      return this._consume(queue, (msg: Message) => {
        this._cancel(consumerInfo).then(() => {
          return this.deleteQueue(queue, { ifUnused: true, ifEmpty: true });
        }).catch((err: Error) => {
          debug('[RPC-WARNING]', err);
        }).then(() => {
          var value = this.msgpack.decode(msg.content);
          if (value === 'undefined') value = undefined;
          if (value instanceof Error) return deferred.reject(value);
          return (msg.properties.correlationId === corrId) ?
              deferred.resolve(value) : deferred.reject(new Error('invalid correlationId'));
        }).catch(err => deferred.reject(err));
      }, { noAck: true }).then(consumer => { return {queue: queue, consumerInfo: consumer}; });
    }).then((result) => {
      consumerInfo = result.consumerInfo;
      return this.sendToQueue(name, this.msgpack.encode(msg), { correlationId: corrId, replyTo: result.queue });
    });
    return deferred.promise;
  }
}

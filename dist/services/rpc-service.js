var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require('bluebird');
var uuid = require('node-uuid');
var _debug = require('debug');
var _ = require('lodash');
var abstract_broker_service_1 = require('./abstract-broker-service');
var debug = _debug('ISLAND:SERVICES:RPC');
var RPCService = (function (_super) {
    __extends(RPCService, _super);
    function RPCService() {
        _super.apply(this, arguments);
        this.consumerInfosMap = {};
    }
    RPCService.prototype.initialize = function () { return Promise.resolve(); };
    RPCService.prototype.purge = function () {
        var _this = this;
        return Promise.reduce(_.keys(this.consumerInfosMap), function (total, name) { return _this.unregister(name); });
    };
    RPCService.prototype.replaceUndefined = function (obj) {
        for (var k in obj) {
            if (obj[k] === undefined) {
                obj[k] = 'undefined';
            }
            else if (typeof obj[k] === 'object') {
                this.replaceUndefined(obj[k]);
            }
        }
    };
    RPCService.prototype.register = function (name, handler) {
        var _this = this;
        // NOTE: 컨슈머가 0개 이상에서 0개가 될 때 자동으로 삭제된다.
        // 단 한번도 컨슈머가 등록되지 않는다면 영원히 삭제되지 않는데 그런 케이스는 없음
        return this.declareQueue(name, { durable: false, autoDelete: true }).then(function () {
            return _this._consume(name, function (msg) {
                // NOTE: handler 에서 발생한 예외는 RPC 실패로 반환한다.
                var req;
                Promise.try(function () {
                    var options = {
                        correlationId: msg.properties.correlationId
                    };
                    return Promise.try(function () {
                        // NOTE: handler 가 es6 Promise를 던지는 경우가 발견되었다.
                        // es6 promise는 timeout 이 없으므로 bluebird promise로 변환하고
                        // handler 자체가 완벽한 promise가 아니라 exception 을 throw 할 수 있어서
                        // Promise.try로 감싼다
                        req = _this.msgpack.decode(msg.content);
                        return Promise.resolve(handler(req));
                    }).then(function (value) {
                        // HACK: Promise<void> 같은 타입 처리
                        if (value === undefined) {
                            value = 'undefined';
                        }
                        else if (typeof value === 'object') {
                            _this.replaceUndefined(value);
                        }
                        return _this.sendToQueue(msg.properties.replyTo, _this.msgpack.encode(value), options);
                    }).timeout(_this.options.rpcTimeout || 10000).catch(function (err) {
                        // RPC 이름을 에러에 추가적으로 기록
                        err.extra = {
                            name: name,
                            req: req
                        };
                        return _this.sendToQueue(msg.properties.replyTo, _this.msgpack.encode(err), options);
                    });
                });
            }).then(function (consumerInfo) { return _this.consumerInfosMap[name] = consumerInfo; });
        });
    };
    RPCService.prototype.unregister = function (name) {
        var _this = this;
        var consumerInfo = this.consumerInfosMap[name];
        debug('consumerInfo: %o', consumerInfo.tag);
        if (!consumerInfo)
            return Promise.resolve();
        return this._cancel(consumerInfo)
            .then(function (ok) {
            delete _this.consumerInfosMap[name];
            return ok;
        });
    };
    RPCService.prototype.invoke = function (name, msg) {
        var _this = this;
        var deferred = Promise.defer();
        var corrId = uuid.v4();
        var consumerInfo;
        this.declareQueue('', { exclusive: true }).then(function (res) {
            var queue = res.queue;
            return _this._consume(queue, function (msg) {
                _this._cancel(consumerInfo).then(function () {
                    return _this.deleteQueue(queue, { ifUnused: true, ifEmpty: true });
                }).catch(function (err) {
                    debug('[RPC-WARNING]', err);
                }).then(function () {
                    var value = _this.msgpack.decode(msg.content);
                    if (value === 'undefined')
                        value = undefined;
                    if (value instanceof Error)
                        return deferred.reject(value);
                    return (msg.properties.correlationId === corrId) ?
                        deferred.resolve(value) : deferred.reject(new Error('invalid correlationId'));
                }).catch(function (err) { return deferred.reject(err); });
            }, { noAck: true }).then(function (consumer) { return { queue: queue, consumerInfo: consumer }; });
        }).then(function (result) {
            consumerInfo = result.consumerInfo;
            return _this.sendToQueue(name, _this.msgpack.encode(msg), { correlationId: corrId, replyTo: result.queue });
        });
        return deferred.promise;
    };
    return RPCService;
})(abstract_broker_service_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RPCService;
//# sourceMappingURL=rpc-service.js.map
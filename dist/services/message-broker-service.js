var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require('bluebird');
var _ = require('lodash');
var abstract_broker_service_1 = require('./abstract-broker-service');
var MessageBrokerService = (function (_super) {
    __extends(MessageBrokerService, _super);
    function MessageBrokerService(connection, serviceName) {
        this.serviceName = serviceName;
        this.handlers = {};
        _super.call(this, connection);
    }
    MessageBrokerService.prototype.initialize = function () {
        var _this = this;
        if (this.initialized)
            return Promise.resolve();
        if (!this.serviceName)
            return Promise.reject(new Error('serviceName is not defined'));
        return this.declareExchange(MessageBrokerService.EXCHANGE_NAME, 'topic', { durable: true }).then(function () {
            return _this.declareQueue(_this.serviceName, { durable: true, exclusive: false });
        }).then(function () {
            _this.initialized = true;
            return _this.consume(_this.onMessage.bind(_this));
        }).then(function (consumerInfo) {
            _this.consumerInfo = consumerInfo;
        });
    };
    MessageBrokerService.prototype.purge = function () {
        var _this = this;
        return this.cancel(this.consumerInfo).then(function () {
            _this.consumerInfo = undefined;
            _this.initialized = false;
        });
    };
    MessageBrokerService.prototype.onMessage = function (msg, routingKey) {
        var _this = this;
        _.keys(this.handlers).forEach(function (pattern) {
            var matcher = _this.matcher(pattern);
            if (matcher.test(routingKey))
                _this.handlers[pattern](msg, routingKey);
        });
    };
    MessageBrokerService.prototype.matcher = function (pattern) {
        var splits = pattern.split('.');
        return new RegExp(splits.map(function (s) {
            return s === '*' ? '[a-zA-Z0-9]*' : (s === '#' ? '[a-zA-Z0-9.]' : s);
        }).join('.'));
    };
    MessageBrokerService.prototype.subscribe = function (pattern, handler) {
        var _this = this;
        if (!this.initialized)
            return Promise.reject(new Error('Not initialized'));
        return this.bindQueue(this.serviceName, MessageBrokerService.EXCHANGE_NAME, pattern).then(function (result) {
            if (handler)
                _this.handlers[pattern] = handler;
            return result;
        });
    };
    MessageBrokerService.prototype.unsubscribe = function (pattern) {
        var _this = this;
        if (!this.initialized)
            return Promise.reject(new Error('Not initialized'));
        return this.unbindQueue(this.serviceName, MessageBrokerService.EXCHANGE_NAME, pattern).then(function (result) {
            delete _this.handlers[pattern];
            return result;
        });
    };
    MessageBrokerService.prototype.publish = function (key, msg) {
        if (!this.initialized)
            return Promise.reject(new Error('Not initialized'));
        return this._publish(MessageBrokerService.EXCHANGE_NAME, key, this.msgpack.encode(msg));
    };
    MessageBrokerService.prototype.consume = function (handler, options) {
        var _this = this;
        if (!this.initialized)
            return Promise.reject(new Error('Not initialized'));
        return this._consume(this.serviceName, function (msg) {
            var decodedParams;
            try {
                decodedParams = _this.msgpack.decode(msg.content);
                handler(decodedParams, msg.fields.routingKey);
            }
            catch (e) {
                _this.publish('log.eventError', {
                    event: msg.fields.routingKey,
                    params: decodedParams || null,
                    error: e
                });
            }
        }, options);
    };
    MessageBrokerService.prototype.cancel = function (consumer) {
        if (!consumer)
            return Promise.reject(new Error('Tag is undefined'));
        if (!this.initialized)
            return Promise.reject(new Error('Not initialized'));
        return this._cancel(consumer);
    };
    MessageBrokerService.EXCHANGE_NAME = 'MESSAGE_BROKER_EXCHANGE';
    return MessageBrokerService;
})(abstract_broker_service_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MessageBrokerService;
//# sourceMappingURL=message-broker-service.js.map
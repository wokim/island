var Promise = require('bluebird');
var msgpack_1 = require('../utils/msgpack');
var AbstractBrokerService = (function () {
    function AbstractBrokerService(connection, options) {
        if (options === void 0) { options = {}; }
        this.connection = connection;
        this.options = options;
        this.msgpack = msgpack_1.default.getInst();
    }
    AbstractBrokerService.prototype.initialize = function () {
        return Promise.reject(new Error('Not initialized exception'));
    };
    AbstractBrokerService.prototype.getChannel = function () {
        var deferred = Promise.defer();
        this.connection.createChannel(function (err, channel) {
            if (err)
                return deferred.reject(err);
            return deferred.resolve(channel);
        });
        return deferred.promise;
    };
    AbstractBrokerService.prototype.call = function (handler, ignoreClosingChannel) {
        return this.getChannel().then(function (channel) {
            channel.on('error', function (err) {
                console.log('channel error:', err);
                err.stack && console.log(err.stack);
            });
            var deferred = Promise.defer();
            // TODO: promise 로 전환할 것
            handler(channel, function (err, ok) {
                if (err)
                    return deferred.reject(err);
                deferred.resolve(ok);
                if (!ignoreClosingChannel)
                    channel.close();
            });
            return deferred.promise;
        });
    };
    AbstractBrokerService.prototype.declareExchange = function (name, type, options) {
        return this.call(function (channel, callback) { return channel.assertExchange(name, type, options, callback); });
    };
    AbstractBrokerService.prototype.deleteExchage = function (name, options) {
        return this.call(function (channel, callback) { return channel.deleteExchange(name, options, callback); });
    };
    AbstractBrokerService.prototype.declareQueue = function (name, options) {
        return this.call(function (channel, callback) { return channel.assertQueue(name, options, callback); });
    };
    AbstractBrokerService.prototype.deleteQueue = function (name, options) {
        return this.call(function (channel, callback) {
            channel.deleteQueue(name, options, callback);
        });
    };
    AbstractBrokerService.prototype.bindQueue = function (queue, source, pattern, args) {
        return this.call(function (channel, callback) {
            channel.bindQueue(queue, source, pattern || '', args, callback);
        });
    };
    AbstractBrokerService.prototype.unbindQueue = function (queue, source, pattern, args) {
        return this.call(function (channel, callback) {
            channel.unbindQueue(queue, source, pattern || '', args, callback);
        });
    };
    AbstractBrokerService.prototype.sendToQueue = function (queue, content, options) {
        return this.call(function (channel, callback) {
            callback(null, channel.sendToQueue(queue, content, options));
        });
    };
    AbstractBrokerService.prototype.ack = function (message, allUpTo) {
        return this.call(function (channel, callback) {
            callback(null, channel.ack(message, allUpTo));
        });
    };
    AbstractBrokerService.prototype._consume = function (key, handler, options) {
        return this.call(function (channel, callback) {
            channel.consume(key, function (msg) {
                handler(msg);
                if (!(options && options.noAck)) {
                    channel.ack(msg); // delivery-tag 가 channel 내에서만 유효하기 때문에 여기서 해야됨.
                }
            }, options || {}, function (err, result) {
                callback(err, { channel: channel, tag: (result || {}).consumerTag });
            });
        }, true);
    };
    AbstractBrokerService.prototype._cancel = function (consumerInfo) {
        var deferred = Promise.defer();
        consumerInfo.channel.cancel(consumerInfo.tag, function (err, ok) {
            if (err)
                return deferred.reject(err);
            consumerInfo.channel.close(function () {
                deferred.resolve(ok);
            });
        });
        return deferred.promise;
    };
    AbstractBrokerService.prototype._publish = function (exchange, routingKey, content, options) {
        return this.call(function (channel, callback) {
            callback(null, channel.publish(exchange, routingKey, content, options));
        });
    };
    return AbstractBrokerService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AbstractBrokerService;
//# sourceMappingURL=abstract-broker-service.js.map
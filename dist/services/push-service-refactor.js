'use strict';
var Promise = require('bluebird');
var msgpack_1 = require('../utils/msgpack');
var _debug = require('debug');
var debug = _debug('ISLAND:SERVICES:PUSH');
var PushService = (function () {
    function PushService(connection) {
        this.connection = connection;
        this.msgpack = msgpack_1.default.getInst();
    }
    PushService.prototype.getChannelDisposer = function () {
        var errorOccured = false;
        return Promise.resolve(this.connection.createChannel())
            .then(function (channel) {
            channel.on('error', function (err) {
                console.log('channel error:', err);
                err.stack && console.log(err.stack);
                errorOccured = true;
            });
            return channel;
        })
            .disposer(function (channel) {
            if (!errorOccured)
                channel.close();
        });
    };
    PushService.prototype.initialize = function () {
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return channel.assertExchange(PushService.PUSH_FANOUT_EXCHANGE, 'fanout', { durable: true });
        });
    };
    PushService.prototype.purge = function () {
        return Promise.using(this.getChannelDisposer(), function (channel) {
            channel.deleteExchange(PushService.PUSH_FANOUT_EXCHANGE, { ifUnused: true, ifEmpty: true });
        });
    };
    PushService.prototype.bindAccount = function (sid, aid) {
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return Promise.all([
                channel.assertQueue(sessionQ(sid), PushService.SESSION_Q_OPTIONS),
                channel.assertExchange(aid, 'direct', PushService.UNICAST_EXCHANGE_OPTIONS),
                channel.assertExchange(PushService.PUSH_FANOUT_EXCHANGE, 'fanout', { durable: true })
            ])
                .then(function () {
                return Promise.all([
                    channel.bindQueue(sessionQ(sid), aid, ''),
                    channel.bindExchange(aid, PushService.PUSH_FANOUT_EXCHANGE, '', {})
                ]);
            });
        });
    };
    PushService.prototype.unbindAccount = function (sid, aid) {
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return Promise.all([
                channel.deleteExchange(aid),
                channel.deleteQueue(sessionQ(sid))
            ]);
        });
    };
    PushService.prototype.bindPlayer = function (sid, pid) {
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return channel.assertExchange(pid, 'direct', PushService.UNICAST_EXCHANGE_OPTIONS)
                .then(function () { return channel.bindQueue(sessionQ(sid), pid, ''); });
        });
    };
    PushService.prototype.unbindPlayer = function (sid, pid) {
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return channel.deleteExchange(pid);
        });
    };
    PushService.prototype.bindExchange = function (destination, source, pattern, sourceType, sourceOpts) {
        debug("bind exchanges. (source:" + source + ") => destination:" + destination);
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return channel.assertExchange(source, sourceType || 'fanout', sourceOpts || PushService.DEFAULT_EXCHANGE_OPTIONS)
                .then(function () { return channel.bindExchange(destination, source, pattern || '', {}); });
        });
    };
    PushService.prototype.unbindExchange = function (destination, source, pattern) {
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return channel.unbindExchange(destination, source, pattern || '', {});
        });
    };
    PushService.prototype.unicast = function (exchange, msg, options) {
        var _this = this;
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return channel.publish(exchange, '', _this.msgpack.encode(msg), options);
        });
    };
    PushService.prototype.multicast = function (exchange, msg, routingKey, options) {
        var _this = this;
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return channel.publish(exchange, routingKey || '', _this.msgpack.encode(msg), options);
        });
    };
    PushService.prototype.broadcast = function (msg, options) {
        var _this = this;
        return Promise.using(this.getChannelDisposer(), function (channel) {
            return channel.assertExchange(PushService.PUSH_FANOUT_EXCHANGE, 'fanout', { durable: true })
                .then(function () { return channel.publish(PushService.PUSH_FANOUT_EXCHANGE, '', _this.msgpack.encode(msg), options); });
        });
    };
    PushService.prototype.consume = function (sid, handler, options) {
        var _this = this;
        return Promise.resolve(this.connection.createChannel())
            .then(function (channel) {
            return channel.assertQueue(sessionQ(sid), PushService.SESSION_Q_OPTIONS)
                .then(function () {
                return channel.consume(sessionQ(sid), function (msg) {
                    if (msg) {
                        handler(msg, _this.msgpack.decode(msg.content));
                        channel.ack(msg);
                    }
                    else {
                        console.log("consumer was cancelled unexpectedly. queue=" + sessionQ);
                    }
                }, options || {});
            })
                .then(function (result) {
                return {
                    channel: channel,
                    tag: (result || {}).consumerTag
                };
            });
        });
    };
    PushService.prototype.cancel = function (consumerInfo) {
        return Promise.try(function () {
            if (!consumerInfo)
                throw new Error('tag is undefined');
            return consumerInfo.channel.cancel(consumerInfo.tag);
        })
            .then(function () { return consumerInfo.channel.close(); });
    };
    PushService.PUSH_FANOUT_EXCHANGE = 'PUSH_FANOUT_EXCHANGE';
    PushService.UNICAST_EXCHANGE_OPTIONS = {
        durable: true,
        autoDelete: true
    };
    PushService.DEFAULT_EXCHANGE_OPTIONS = {
        durable: true,
        autoDelete: true
    };
    PushService.SESSION_Q_OPTIONS = {
        durable: true,
    };
    return PushService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PushService;
// Queue name = session.<sid>
function sessionQ(sid) {
    return "session." + sid;
}
//# sourceMappingURL=push-service-refactor.js.map
var Promise = require('bluebird');
var _ = require('lodash');
var _debug = require('debug');
var debug = _debug('ISLAND:CTRL:ENDPOINT');
function endpoint(name, options) {
    return function _endpointMethodDecorator(target, key, desc) {
        var mangledName = name.replace(' ', '@').replace(/\//g, '|');
        var constructor = target.constructor;
        constructor._endpointMethods = constructor._endpointMethods || {};
        constructor._endpointMethods[mangledName] = {
            options: options,
            handler: desc.value
        };
    };
}
exports.endpoint = endpoint;
function endpointController(registerer) {
    return function _endpointControllerDecorator(target) {
        var _onInitialized = target.prototype.onInitialized;
        target.prototype.onInitialized = function () {
            var _this = this;
            return Promise.all(_.map(target._endpointMethods, function (v, name) {
                if (v.options && v.options.developmentOnly && process.env.NODE_ENV !== 'development') {
                    return Promise.resolve();
                }
                debug('ENDPOINT 등록:', name);
                return _this.server.register(name, v.handler.bind(_this)).then(function () {
                    return registerer && registerer.registerEndpoint(name, v.options || {}) || Promise.resolve();
                });
            }))
                .then(function () { return _onInitialized.apply(_this); });
        };
        var _onDestroy = target.prototype.onDestroy;
        target.prototype.onDestroy = function () {
            var _this = this;
            return Promise.all(_.map(target._endpointMethods, function (__, name) {
                debug('stop serving', name);
                return _this.server.unregister(name);
            }))
                .then(function () { return _onDestroy.apply(_this); });
        };
    };
}
exports.endpointController = endpointController;
function rpc(target, key, desc) {
    var constructor = target.constructor;
    constructor._rpcMethods = constructor._rpcMethods || {};
    constructor._rpcMethods[key] = desc.value;
}
exports.rpc = rpc;
function rpcController(target) {
    var _onInitialized = target.prototype.onInitialized;
    target.prototype.onInitialized = function () {
        var _this = this;
        return Promise.all(_.map(target._rpcMethods, function (handler, name) {
            debug('RPC 등록:', name);
            return _this.server.register(name, handler.bind(_this));
        }))
            .then(function () { return _onInitialized.apply(_this); });
    };
    var _onDestroy = target.prototype.onDestroy;
    target.prototype.onDestroy = function () {
        var _this = this;
        return Promise.all(_.map(target._rpcMethods, function (__, name) {
            debug('stop serving', name);
            return _this.server.unregister(name);
        }))
            .then(function () { return _onDestroy.apply(_this); });
    };
}
exports.rpcController = rpcController;
//# sourceMappingURL=endpoint-decorator.js.map
var _ = require('lodash');
var Promise = require('bluebird');
var listenable_adapter_1 = require('./adapters/listenable-adapter');
var debug = require('debug')('ISLAND:ISLET');
/**
 * Create a new Islet.
 * @abstract
 * @class
 */
var Islet = (function () {
    function Islet() {
        /** @type {Object.<string, IAbstractAdapter>} [adapters={}] */
        this.adapters = {};
    }
    /**
     * Register the islet which is the suite of micro-service
     * @param {Islet} islet
     * @static
     */
    Islet.registerIslet = function (islet) {
        if (Islet.islet)
            throw new Error('The islet already has been registered.');
        Islet.islet = islet;
    };
    Islet.getIslet = function () {
        return Islet.islet;
    };
    /**
     * Instantiate and run a microservice.
     * @param {Microservice} Class
     * @static
     */
    Islet.run = function (Class) {
        if (this.islet)
            return;
        var Class;
        var config;
        // Create such a micro-service instance.
        var islet = new Class();
        this.registerIslet(islet);
        islet.main();
        return islet.initialize().then(function () { return islet.start(); });
    };
    /**
     * Register the adapter.
     * @param {string} name
     * @param {IAbstractAdapter} adapter
     */
    Islet.prototype.registerAdapter = function (name, adapter) {
        if (this.adapters[name])
            throw new Error('duplicated adapter');
        this.adapters[name] = adapter;
    };
    Islet.prototype.getAdaptee = function (name) {
        if (!this.adapters[name])
            throw new Error('Missing adapter');
        return this.adapters[name].adaptee;
    };
    /**
     * @abstract
     */
    Islet.prototype.main = function () {
        throw new Error('Not implemented exception.');
    };
    /**
     * @returns {Promise<void>}
     */
    Islet.prototype.initialize = function () {
        var _this = this;
        return Promise.all(_.values(this.adapters).map(function (adapter) { return adapter.initialize(); })).then(function () {
            // 모든 adapter가 초기화되면 onInitialize() 를 호출해준다
            return Promise.resolve(_this.onInitialized());
        });
    };
    Islet.prototype.onInitialized = function () { };
    Islet.prototype.onDestroy = function () { };
    /**
     * @returns {Promise<void>}
     */
    Islet.prototype.start = function () {
        var adapters = _.values(this.adapters).filter(function (adapter) {
            return adapter instanceof listenable_adapter_1.default;
        });
        // Initialize all of the adapters to register resource into routing table.
        return Promise.all(adapters.map(function (adapter) { return adapter.postInitialize(); }))
            .then(function () { return Promise.all(adapters.map(function (adapter) { return adapter.listen(); })); });
    };
    Islet.prototype.destroy = function () {
        var _this = this;
        // TODO: 각 adapter의 destroy 호출해준다
        var adapters = _.values(this.adapters).filter(function (adapter) { return (adapter instanceof listenable_adapter_1.default); });
        return Promise.all(adapters.map(function (adapter) { return adapter.close().then(function () { return adapter.destroy(); }); })).then(function () { return _this.onDestroy(); });
    };
    return Islet;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Islet;
//# sourceMappingURL=islet.js.map
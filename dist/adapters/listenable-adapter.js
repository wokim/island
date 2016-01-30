var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require('bluebird');
var abstract_adapter_1 = require('./abstract-adapter');
/**
 * Abstract adapter class for back-end service.
 * @abstract
 * @class
 * @extends AbstractAdapter
 * @implements IListenableAdapter
 */
var ListenableAdapter = (function (_super) {
    __extends(ListenableAdapter, _super);
    function ListenableAdapter() {
        _super.apply(this, arguments);
        this._controllersClasses = [];
        this._controllers = [];
    }
    /**
     * @param {AbstractController} Class
     */
    ListenableAdapter.prototype.registerController = function (Class) {
        this._controllersClasses.push(Class);
    };
    /**
     * @returns {Promise<void>}
     * @final
     */
    ListenableAdapter.prototype.postInitialize = function () {
        var _this = this;
        return Promise.all(this._controllersClasses.map(function (ControllerClass) {
            var c = new ControllerClass(_this._adaptee);
            _this._controllers.push(c);
            return Promise.try(function () { return c.initialize(); }).then(function () { return c.onInitialized(); });
        }));
    };
    /**
     * @abstract
     * @returns {Promise<void>}
     */
    ListenableAdapter.prototype.listen = function () {
        throw new Error('Not implemented error');
        return Promise.resolve();
    };
    ListenableAdapter.prototype.destroy = function () {
        var _this = this;
        return Promise.all(this._controllers.map(function (c) { return Promise.try(function () { return c.onDestroy(); }); })).then(function () {
            _this._controllersClasses = [];
            _this._controllers = [];
        });
    };
    ListenableAdapter.prototype.close = function () {
        return Promise.resolve();
    };
    return ListenableAdapter;
})(abstract_adapter_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ListenableAdapter;
//# sourceMappingURL=listenable-adapter.js.map
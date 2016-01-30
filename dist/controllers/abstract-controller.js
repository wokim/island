/**
 * AbstractController<T>
 * @abstract
 * @class
 */
var AbstractController = (function () {
    /**
     * Connect your own controller here.
     * @constructs
     * @param {T} server
     */
    function AbstractController(server) {
        this._server = server;
    }
    Object.defineProperty(AbstractController.prototype, "server", {
        /**
         * @returns {T}
         */
        get: function () { return this._server; },
        enumerable: true,
        configurable: true
    });
    /**
     * @abstract
     * @returns {Promise<void>}
     */
    AbstractController.prototype.initialize = function () { };
    AbstractController.prototype.onInitialized = function () { };
    AbstractController.prototype.onDestroy = function () { };
    return AbstractController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AbstractController;
//# sourceMappingURL=abstract-controller.js.map
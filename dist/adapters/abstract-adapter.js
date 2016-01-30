var Promise = require('bluebird');
/**
 * Abstract adapter class for back-end service.
 * @abstract
 * @class
 * @implements IAbstractAdapter
 */
var AbstractAdapter = (function () {
    function AbstractAdapter(options) {
        this._options = options;
    }
    Object.defineProperty(AbstractAdapter.prototype, "adaptee", {
        get: function () { return this._adaptee; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractAdapter.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    /**
     * @abstract
     * @returns {Promise<any>}
     */
    AbstractAdapter.prototype.initialize = function () {
        throw new Error('Not implemented error');
        return Promise.resolve();
    };
    return AbstractAdapter;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AbstractAdapter;
//# sourceMappingURL=abstract-adapter.js.map
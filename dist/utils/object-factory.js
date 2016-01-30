/**
 * ModelFactory
 * @class
 */
var ObjectFactory = (function () {
    function ObjectFactory() {
    }
    /**
     * Retrieves the wrapped object of given wrapper.
     * @param {typeof ObjectWrapper} Class
     * @returns {T}
     */
    ObjectFactory.get = function (Class) {
        var name = Class.prototype.constructor.name;
        var instance = this.models[name];
        if (!instance) {
            this.models[name] = instance = new Class();
            instance.initialize();
            instance.onInitialized();
            return instance.Object;
        }
        return instance.Object;
    };
    ObjectFactory.models = {};
    return ObjectFactory;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ObjectFactory;
//# sourceMappingURL=object-factory.js.map
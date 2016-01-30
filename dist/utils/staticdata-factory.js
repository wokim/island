/**
 * ModelFactory
 * @class
 */
var StaticDataFactory = (function () {
    function StaticDataFactory() {
    }
    /**
     * Retrieves the wrapped static-data object of given loader.
     *
     * @param Class
     * @returns {any}
     */
    StaticDataFactory.get = function (Class) {
        var name = Class.prototype.constructor.name;
        var instance = this.staticData[name];
        if (!instance) {
            this.staticData[name] = instance = new Class();
            instance.initialize();
        }
        return instance.Object;
    };
    StaticDataFactory.staticData = {};
    return StaticDataFactory;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StaticDataFactory;
//# sourceMappingURL=staticdata-factory.js.map
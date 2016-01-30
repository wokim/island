/**
 * ModelFactory
 * @class
 */
var ModelFactory = (function () {
    function ModelFactory() {
    }
    ModelFactory.get = function (Class) {
        var name = Class.prototype.constructor.name;
        var instance = this.models[name];
        if (!instance) {
            this.models[name] = instance = new Class();
            return instance;
        }
        return instance;
    };
    ModelFactory.models = {};
    return ModelFactory;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelFactory;
//# sourceMappingURL=model-factory.js.map
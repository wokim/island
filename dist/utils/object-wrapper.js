var ObjectWrapper = (function () {
    function ObjectWrapper() {
    }
    Object.defineProperty(ObjectWrapper.prototype, "Object", {
        get: function () {
            if (!this.object)
                throw new Error('Not initialized exception');
            return this.object;
        },
        enumerable: true,
        configurable: true
    });
    ObjectWrapper.prototype.initialize = function () {
        throw new Error('Not implemented exception');
    };
    ObjectWrapper.prototype.onInitialized = function () { };
    return ObjectWrapper;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ObjectWrapper;
//# sourceMappingURL=object-wrapper.js.map
var StaticDataLoader = (function () {
    function StaticDataLoader() {
    }
    Object.defineProperty(StaticDataLoader.prototype, "Object", {
        get: function () {
            if (!this.object)
                throw new Error('Exception :: This object is not initialized');
            return this.object;
        },
        enumerable: true,
        configurable: true
    });
    StaticDataLoader.prototype.initialize = function () {
        throw new Error('Exception :: This object is not implemented.');
    };
    return StaticDataLoader;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StaticDataLoader;
//# sourceMappingURL=staticdata-loader.js.map
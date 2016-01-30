var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mongoose = require('mongoose');
var Promise = require('bluebird');
var abstract_adapter_1 = require('../abstract-adapter');
/**
 * MongooseAdapter
 * @class
 * @extends AbstractAdapter
 */
var MongooseAdapter = (function (_super) {
    __extends(MongooseAdapter, _super);
    function MongooseAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * Initialize the mongoose connection.
     * @returns {Promise<void>}
     * @override
     */
    MongooseAdapter.prototype.initialize = function () {
        var _this = this;
        var options = this.options;
        var deferred = Promise.defer();
        // Mongoose buffers all the commands until it's connected to the database.
        // But make sure to the case of using a external mongodb connector
        var connection = mongoose.createConnection(options.uri, options.connectionOptions);
        connection.once('open', function () {
            _this._adaptee = connection;
            connection.removeAllListeners();
            deferred.resolve();
        });
        connection.once('error', function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
    return MongooseAdapter;
})(abstract_adapter_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MongooseAdapter;
//# sourceMappingURL=mongoose-adapter.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var redis = require('redis');
var Promise = require('bluebird');
var abstract_adapter_1 = require('../abstract-adapter');
/**
 * RedisConnectionAdapter
 * @class
 * @extends AbstractAdapter
 */
var RedisConnectionAdapter = (function (_super) {
    __extends(RedisConnectionAdapter, _super);
    function RedisConnectionAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * Initialize the redis connection.
     * @returns {Promise<void>}
     * @override
     */
    RedisConnectionAdapter.prototype.initialize = function () {
        var _this = this;
        var options = this.options;
        var deferred = Promise.defer();
        var client = redis.createClient(options.port, options.host, options.clientOpts);
        // Although all commands before the connection are accumulated in the queue,
        // Make sure for the case of using a external redis connector.
        client.once('ready', function () {
            _this._adaptee = client;
            client.removeAllListeners();
            deferred.resolve();
        });
        client.once('error', function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
    return RedisConnectionAdapter;
})(abstract_adapter_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RedisConnectionAdapter;
//# sourceMappingURL=redis-connection-adapter.js.map
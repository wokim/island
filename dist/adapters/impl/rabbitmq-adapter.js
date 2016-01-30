var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var amqp = require('amqplib/callback_api');
var Promise = require('bluebird');
var listenable_adapter_1 = require('../listenable-adapter');
var RabbitMqAdapter = (function (_super) {
    __extends(RabbitMqAdapter, _super);
    function RabbitMqAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * @returns {Promise<void>}
     * @override
     */
    RabbitMqAdapter.prototype.initialize = function () {
        var _this = this;
        var options = this.options;
        var deferred = Promise.defer();
        amqp.connect(options.url, options.socketOptions, function (err, connection) {
            if (err)
                return deferred.reject(err);
            _this.connection = connection;
            // TODO: reconnect process
            process.once('SIGINT', function () { connection.close(); });
            deferred.resolve();
        });
        return deferred.promise;
    };
    RabbitMqAdapter.prototype.listen = function () {
        return Promise.resolve();
    };
    return RabbitMqAdapter;
})(listenable_adapter_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RabbitMqAdapter;
//# sourceMappingURL=rabbitmq-adapter.js.map
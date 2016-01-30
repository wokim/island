'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var amqp = require('amqplib');
var Promise = require('bluebird');
var listenable_adapter_1 = require('../listenable-adapter');
var push_service_refactor_1 = require('../../services/push-service-refactor');
var PushAdapter = (function (_super) {
    __extends(PushAdapter, _super);
    function PushAdapter() {
        _super.apply(this, arguments);
    }
    PushAdapter.prototype.initialize = function () {
        var _this = this;
        var options = this.options;
        return Promise.resolve(amqp.connect(options.url, options.socketOptions))
            .then(function (connection) {
            _this.connection = connection;
            process.once('SIGINT', function () { connection.close(); });
            _this._adaptee = new push_service_refactor_1.default(_this.connection);
            return _this._adaptee.initialize();
        });
    };
    PushAdapter.prototype.listen = function () {
        return Promise.resolve();
    };
    return PushAdapter;
})(listenable_adapter_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PushAdapter;
//# sourceMappingURL=push-adapter-refactor.js.map
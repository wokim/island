var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rabbitmq_adapter_1 = require('./rabbitmq-adapter');
var message_broker_service_1 = require('../../services/message-broker-service');
var MessageBrokerAdapter = (function (_super) {
    __extends(MessageBrokerAdapter, _super);
    function MessageBrokerAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * @returns {Promise<void>}
     * @override
     */
    MessageBrokerAdapter.prototype.initialize = function () {
        var _this = this;
        return _super.prototype.initialize.call(this).then(function () {
            _this._adaptee = new message_broker_service_1.default(_this.connection, _this.options.serviceName || 'unknownService');
            return _this._adaptee.initialize();
        });
    };
    return MessageBrokerAdapter;
})(rabbitmq_adapter_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MessageBrokerAdapter;
//# sourceMappingURL=message-broker-adapter.js.map
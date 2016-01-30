var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rabbitmq_adapter_1 = require('./rabbitmq-adapter');
var rpc_service_1 = require('../../services/rpc-service');
var RPCAdapter = (function (_super) {
    __extends(RPCAdapter, _super);
    function RPCAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * @returns {Promise<void>}
     * @override
     */
    RPCAdapter.prototype.initialize = function () {
        var _this = this;
        return _super.prototype.initialize.call(this).then(function () {
            _this._adaptee = new rpc_service_1.default(_this.connection, _this.options);
            return _this._adaptee.initialize();
        });
    };
    return RPCAdapter;
})(rabbitmq_adapter_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RPCAdapter;
//# sourceMappingURL=rpc-adapter.js.map
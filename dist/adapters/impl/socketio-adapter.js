var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var io = require('socket.io');
var Promise = require('bluebird');
var listenable_adapter_1 = require('../listenable-adapter');
var SocketIOAdapter = (function (_super) {
    __extends(SocketIOAdapter, _super);
    function SocketIOAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * @returns {Promise<void>}
     * @override
     */
    SocketIOAdapter.prototype.initialize = function () {
        var options = this.options;
        this._adaptee = io({ transports: ['websocket', 'polling', 'flashsocket'] });
        return Promise.resolve();
    };
    /**
     * @override
     * @returns {Promise<void>}
     */
    SocketIOAdapter.prototype.listen = function () {
        this.adaptee.listen(this.options.port);
        return Promise.resolve();
    };
    return SocketIOAdapter;
})(listenable_adapter_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SocketIOAdapter;
//# sourceMappingURL=socketio-adapter.js.map
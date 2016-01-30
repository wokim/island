var msgpack5 = require('msgpack5');
var _debug = require('debug');
var debug = _debug('ISLAND:UTILS:MSGPACK');
var MessagePack = (function () {
    function MessagePack() {
        this.packer = msgpack5();
        if (MessagePack.instance) {
            throw new Error('Error: Instantiation failed: Use getInst() instead of new.');
        }
        MessagePack.instance = this;
        // NOTE: timestamp를 직접 buffer에 쓰면 더 압축할 수 있다.
        this.packer.register(0x01, Date, function (date) {
            return new Buffer(date.toISOString());
        }, function (buf) {
            return new Date(buf.toString());
        });
        this.packer.register(0x03, Error, function (error) {
            return new Buffer(JSON.stringify({
                name: error.name,
                message: error.message,
                stack: error.stack,
                statusCode: error.statusCode,
                extra: error.extra
            }));
        }, function (buf) {
            // TODO: edge.Error를 정의하기 전 까지 임시로 사용
            var errorObject = JSON.parse(buf.toString());
            var err = new Error(errorObject.message);
            err.name = errorObject.name;
            err.stack = errorObject.stack;
            err.statusCode = errorObject.statusCode;
            err.extra = errorObject.extra;
            return err;
        });
    }
    MessagePack.getInst = function () {
        if (!MessagePack.instance) {
            MessagePack.instance = new MessagePack();
        }
        return MessagePack.instance;
    };
    MessagePack.prototype.encode = function (obj) {
        try {
            return this.packer.encode(obj);
        }
        catch (e) {
            debug('[MSG ENCODE ERROR]', e);
            var error = new Error();
            debug(error.stack);
            throw e;
        }
    };
    MessagePack.prototype.decode = function (buf) {
        return this.packer.decode(buf);
    };
    return MessagePack;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MessagePack;
//# sourceMappingURL=msgpack.js.map
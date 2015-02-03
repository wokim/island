var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../typings/tsd.d.ts" />
var amqp = require('amqplib/callback_api');
var Promise = require('bluebird');
var AbstractAdapter = require('../abstract-adapter');
var AMQPAdapter = (function (_super) {
    __extends(AMQPAdapter, _super);
    function AMQPAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * @returns {Promise<void>}
     * @override
     */
    AMQPAdapter.prototype.initialize = function () {
        var _this = this;
        var options = this.options;
        var deferred = Promise.defer();
        amqp.connect(options.url, options.socketOptions, function (err, conn) {
            if (err)
                return deferred.reject(err);
            conn.createChannel(function (err, ch) {
                if (err)
                    return deferred.reject(err);
                _this._adaptee = ch;
                deferred.resolve();
            });
        });
        return deferred.promise;
    };
    return AMQPAdapter;
})(AbstractAdapter);
module.exports = AMQPAdapter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkYXB0ZXJzL2ltcGwvYW1xcC1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbIkFNUVBBZGFwdGVyIiwiQU1RUEFkYXB0ZXIuY29uc3RydWN0b3IiLCJBTVFQQWRhcHRlci5pbml0aWFsaXplIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxBQUNBLGtEQURrRDtBQUNsRCxJQUFPLElBQUksV0FBVyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzlDLElBQU8sT0FBTyxXQUFXLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLElBQU8sZUFBZSxXQUFXLHFCQUFxQixDQUFDLENBQUM7QUFHeEQsSUFBTSxXQUFXO0lBQVNBLFVBQXBCQSxXQUFXQSxVQUEwREE7SUFBM0VBLFNBQU1BLFdBQVdBO1FBQVNDLDhCQUFpREE7SUFrQjNFQSxDQUFDQTtJQWpCQ0Q7OztPQUdHQTtJQUNJQSxnQ0FBVUEsR0FBakJBO1FBQUFFLGlCQVlDQTtRQVhDQSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUMzQkEsSUFBSUEsUUFBUUEsR0FBR0EsT0FBT0EsQ0FBQ0EsS0FBS0EsRUFBUUEsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLEVBQUVBLE9BQU9BLENBQUNBLGFBQWFBLEVBQUVBLFVBQUNBLEdBQUdBLEVBQUVBLElBQUlBO1lBQ3pEQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDckNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFVBQUNBLEdBQUdBLEVBQUVBLEVBQUVBO2dCQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0E7b0JBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNyQ0EsS0FBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ25CQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtZQUNyQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDTEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDSEEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7SUFDMUJBLENBQUNBO0lBQ0hGLGtCQUFDQTtBQUFEQSxDQWxCQSxBQWtCQ0EsRUFsQnlCLGVBQWUsRUFrQnhDO0FBRUQsQUFBcUIsaUJBQVosV0FBVyxDQUFDIiwiZmlsZSI6ImFkYXB0ZXJzL2ltcGwvYW1xcC1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy93b2tpbS9Qcm9qZWN0cy9ORlMvcmhvbWJ1cy9tZXRhL2JlL2V4dGVybmFscy9pc2xhbmQvIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuaW1wb3J0IGFtcXAgPSByZXF1aXJlKCdhbXFwbGliL2NhbGxiYWNrX2FwaScpO1xuaW1wb3J0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuaW1wb3J0IEFic3RyYWN0QWRhcHRlciA9IHJlcXVpcmUoJy4uL2Fic3RyYWN0LWFkYXB0ZXInKTtcbmltcG9ydCBBTVFQQWRhcHRlck9wdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9vcHRpb25zL2FtcXAtYWRhcHRlci1vcHRpb25zJyk7XG5cbmNsYXNzIEFNUVBBZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RBZGFwdGVyPGFtcXAuQ2hhbm5lbCwgQU1RUEFkYXB0ZXJPcHRpb25zPiB7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICogQG92ZXJyaWRlXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgZGVmZXJyZWQgPSBQcm9taXNlLmRlZmVyPHZvaWQ+KCk7XG4gICAgYW1xcC5jb25uZWN0KG9wdGlvbnMudXJsLCBvcHRpb25zLnNvY2tldE9wdGlvbnMsIChlcnIsIGNvbm4pID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIGNvbm4uY3JlYXRlQ2hhbm5lbCgoZXJyLCBjaCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICAgIHRoaXMuX2FkYXB0ZWUgPSBjaDtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbn1cblxuZXhwb3J0ID0gQU1RUEFkYXB0ZXI7Il19
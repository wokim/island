var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../typings/tsd.d.ts" />
var redis = require('redis');
var Promise = require('bluebird');
var AbstractAdapter = require('../abstract-adapter');
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
        client.once('connect', function () {
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
})(AbstractAdapter);
module.exports = RedisConnectionAdapter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkYXB0ZXJzL2ltcGwvcmVkaXMtY29ubmVjdGlvbi1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbIlJlZGlzQ29ubmVjdGlvbkFkYXB0ZXIiLCJSZWRpc0Nvbm5lY3Rpb25BZGFwdGVyLmNvbnN0cnVjdG9yIiwiUmVkaXNDb25uZWN0aW9uQWRhcHRlci5pbml0aWFsaXplIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxBQUNBLGtEQURrRDtBQUNsRCxJQUFPLEtBQUssV0FBVyxPQUFPLENBQUMsQ0FBQztBQUNoQyxJQUFPLE9BQU8sV0FBVyxVQUFVLENBQUMsQ0FBQztBQUNyQyxJQUFPLGVBQWUsV0FBVyxxQkFBcUIsQ0FBQyxDQUFDO0FBR3hELEFBS0E7Ozs7R0FERztJQUNHLHNCQUFzQjtJQUFTQSxVQUEvQkEsc0JBQXNCQSxVQUFnRUE7SUFBNUZBLFNBQU1BLHNCQUFzQkE7UUFBU0MsOEJBQXVEQTtJQXVCNUZBLENBQUNBO0lBdEJDRDs7OztPQUlHQTtJQUNJQSwyQ0FBVUEsR0FBakJBO1FBQUFFLGlCQWdCQ0E7UUFmQ0EsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDM0JBLElBQUlBLFFBQVFBLEdBQUdBLE9BQU9BLENBQUNBLEtBQUtBLEVBQVFBLENBQUNBO1FBQ3JDQSxJQUFJQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUVoRkEsQUFFQUEsNEVBRjRFQTtRQUM1RUEsOERBQThEQTtRQUM5REEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUE7WUFDckJBLEtBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLENBQUNBO1lBQ3ZCQSxNQUFNQSxDQUFDQSxrQkFBa0JBLEVBQUVBLENBQUNBO1lBQzVCQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtRQUNyQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDSEEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsVUFBQUEsR0FBR0E7WUFDdEJBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3ZCQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNIQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQTtJQUMxQkEsQ0FBQ0E7SUFDSEYsNkJBQUNBO0FBQURBLENBdkJBLEFBdUJDQSxFQXZCb0MsZUFBZSxFQXVCbkQ7QUFFRCxBQUFnQyxpQkFBdkIsc0JBQXNCLENBQUMiLCJmaWxlIjoiYWRhcHRlcnMvaW1wbC9yZWRpcy1jb25uZWN0aW9uLWFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3dva2ltL1Byb2plY3RzL05GUy9yaG9tYnVzL21ldGEvYmUvZXh0ZXJuYWxzL2lzbGFuZC8iLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XG5pbXBvcnQgcmVkaXMgPSByZXF1aXJlKCdyZWRpcycpO1xuaW1wb3J0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuaW1wb3J0IEFic3RyYWN0QWRhcHRlciA9IHJlcXVpcmUoJy4uL2Fic3RyYWN0LWFkYXB0ZXInKTtcbmltcG9ydCBSZWRpc0FkYXB0ZXJPcHRpb25zID0gcmVxdWlyZSgnLi4vLi4vb3B0aW9ucy9yZWRpcy1hZGFwdGVyLW9wdGlvbnMnKTtcblxuLyoqXG4gKiBSZWRpc0Nvbm5lY3Rpb25BZGFwdGVyXG4gKiBAY2xhc3NcbiAqIEBleHRlbmRzIEFic3RyYWN0QWRhcHRlclxuICovXG5jbGFzcyBSZWRpc0Nvbm5lY3Rpb25BZGFwdGVyIGV4dGVuZHMgQWJzdHJhY3RBZGFwdGVyPHJlZGlzLlJlZGlzQ2xpZW50LCBSZWRpc0FkYXB0ZXJPcHRpb25zPiB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSByZWRpcyBjb25uZWN0aW9uLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICogQG92ZXJyaWRlXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgZGVmZXJyZWQgPSBQcm9taXNlLmRlZmVyPHZvaWQ+KCk7XG4gICAgdmFyIGNsaWVudCA9IHJlZGlzLmNyZWF0ZUNsaWVudChvcHRpb25zLnBvcnQsIG9wdGlvbnMuaG9zdCwgb3B0aW9ucy5jbGllbnRPcHRzKTtcblxuICAgIC8vIEFsdGhvdWdoIGFsbCBjb21tYW5kcyBiZWZvcmUgdGhlIGNvbm5lY3Rpb24gYXJlIGFjY3VtdWxhdGVkIGluIHRoZSBxdWV1ZSxcbiAgICAvLyBNYWtlIHN1cmUgZm9yIHRoZSBjYXNlIG9mIHVzaW5nIGEgZXh0ZXJuYWwgcmVkaXMgY29ubmVjdG9yLlxuICAgIGNsaWVudC5vbmNlKCdjb25uZWN0JywgKCkgPT4ge1xuICAgICAgdGhpcy5fYWRhcHRlZSA9IGNsaWVudDtcbiAgICAgIGNsaWVudC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICB9KTtcbiAgICBjbGllbnQub25jZSgnZXJyb3InLCBlcnIgPT4ge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbn1cblxuZXhwb3J0ID0gUmVkaXNDb25uZWN0aW9uQWRhcHRlcjsiXX0=
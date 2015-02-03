var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../typings/tsd.d.ts" />
var restify = require('restify');
var Promise = require('bluebird');
var ListenableAdapter = require('../listenable-adapter');
var jwt = require('./middlewares/restify-jwt-middleware');
var session = require('./middlewares/restify-session-middleware');
/**
 * RestifyAdapter
 * @class
 * @extends ListenableAdapter
 */
var RestifyAdapter = (function (_super) {
    __extends(RestifyAdapter, _super);
    function RestifyAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * Initialize the restify server.
     * @override
     * @returns {Promise<void>}
     */
    RestifyAdapter.prototype.initialize = function () {
        var options = this.options;
        var server = restify.createServer(options);
        // Set default middleware
        server.use(restify.bodyParser({
            // TODO: export below params to external configuation file
            maxBodySize: 0
        }));
        // TODO: RSA-SHA256 is the recommendation.
        // Parse only if the Authorization header is the bearer JWT token.
        server.use(jwt({ secret: options.secret }));
        server.use(session({ store: options.store }));
        if (options.middlewares) {
            server.use(options.middlewares);
        }
        this._adaptee = server;
        return Promise.resolve();
    };
    /**
     * Listen the restify server.
     * @override
     * @returns {Promise<void>}
     */
    RestifyAdapter.prototype.listen = function () {
        var deferred = Promise.defer();
        this.adaptee.listen(this.options.port, function (err) {
            if (err)
                return deferred.reject(err);
            deferred.resolve();
        });
        return deferred.promise;
    };
    return RestifyAdapter;
})(ListenableAdapter);
module.exports = RestifyAdapter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkYXB0ZXJzL2ltcGwvcmVzdGlmeS1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbIlJlc3RpZnlBZGFwdGVyIiwiUmVzdGlmeUFkYXB0ZXIuY29uc3RydWN0b3IiLCJSZXN0aWZ5QWRhcHRlci5pbml0aWFsaXplIiwiUmVzdGlmeUFkYXB0ZXIubGlzdGVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxBQUNBLGtEQURrRDtBQUNsRCxJQUFPLE9BQU8sV0FBVyxTQUFTLENBQUMsQ0FBQztBQUNwQyxJQUFPLE9BQU8sV0FBVyxVQUFVLENBQUMsQ0FBQztBQUNyQyxJQUFPLGlCQUFpQixXQUFXLHVCQUF1QixDQUFDLENBQUM7QUFDNUQsSUFBTyxHQUFHLFdBQVcsc0NBQXNDLENBQUMsQ0FBQztBQUM3RCxJQUFPLE9BQU8sV0FBVywwQ0FBMEMsQ0FBQyxDQUFDO0FBR3JFLEFBS0E7Ozs7R0FERztJQUNHLGNBQWM7SUFBU0EsVUFBdkJBLGNBQWNBLFVBQWlFQTtJQUFyRkEsU0FBTUEsY0FBY0E7UUFBU0MsOEJBQXdEQTtJQTBDckZBLENBQUNBO0lBekNDRDs7OztPQUlHQTtJQUNJQSxtQ0FBVUEsR0FBakJBO1FBQ0VFLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBO1FBQzNCQSxJQUFJQSxNQUFNQSxHQUFHQSxPQUFPQSxDQUFDQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUUzQ0EsQUFDQUEseUJBRHlCQTtRQUN6QkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7WUFDNUJBLEFBQ0FBLDBEQUQwREE7WUFDMURBLFdBQVdBLEVBQUVBLENBQUNBO1NBQ2ZBLENBQUNBLENBQUNBLENBQUNBO1FBRUpBLEFBRUFBLDBDQUYwQ0E7UUFDMUNBLGtFQUFrRUE7UUFDbEVBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLE1BQU1BLEVBQUVBLE9BQU9BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzVDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxFQUFFQSxLQUFLQSxFQUFFQSxPQUFPQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU5Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO1FBQ2xDQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUN2QkEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBRURGOzs7O09BSUdBO0lBQ0lBLCtCQUFNQSxHQUFiQTtRQUNFRyxJQUFJQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQSxLQUFLQSxFQUFRQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsRUFBQ0EsVUFBQ0EsR0FBR0E7WUFDeENBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNyQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7UUFDckJBLENBQUNBLENBQUNBLENBQUNBO1FBQ0hBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBO0lBQzFCQSxDQUFDQTtJQUNISCxxQkFBQ0E7QUFBREEsQ0ExQ0EsQUEwQ0NBLEVBMUM0QixpQkFBaUIsRUEwQzdDO0FBRUQsQUFBd0IsaUJBQWYsY0FBYyxDQUFDIiwiZmlsZSI6ImFkYXB0ZXJzL2ltcGwvcmVzdGlmeS1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy93b2tpbS9Qcm9qZWN0cy9ORlMvcmhvbWJ1cy9tZXRhL2JlL2V4dGVybmFscy9pc2xhbmQvIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuaW1wb3J0IHJlc3RpZnkgPSByZXF1aXJlKCdyZXN0aWZ5Jyk7XG5pbXBvcnQgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5pbXBvcnQgTGlzdGVuYWJsZUFkYXB0ZXIgPSByZXF1aXJlKCcuLi9saXN0ZW5hYmxlLWFkYXB0ZXInKTtcbmltcG9ydCBqd3QgPSByZXF1aXJlKCcuL21pZGRsZXdhcmVzL3Jlc3RpZnktand0LW1pZGRsZXdhcmUnKTtcbmltcG9ydCBzZXNzaW9uID0gcmVxdWlyZSgnLi9taWRkbGV3YXJlcy9yZXN0aWZ5LXNlc3Npb24tbWlkZGxld2FyZScpO1xuaW1wb3J0IFJlc3RpZnlBZGFwdGVyT3B0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL29wdGlvbnMvcmVzdGlmeS1hZGFwdGVyLW9wdGlvbnMnKTtcblxuLyoqXG4gKiBSZXN0aWZ5QWRhcHRlclxuICogQGNsYXNzXG4gKiBAZXh0ZW5kcyBMaXN0ZW5hYmxlQWRhcHRlclxuICovXG5jbGFzcyBSZXN0aWZ5QWRhcHRlciBleHRlbmRzIExpc3RlbmFibGVBZGFwdGVyPHJlc3RpZnkuU2VydmVyLCBSZXN0aWZ5QWRhcHRlck9wdGlvbnM+IHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHJlc3RpZnkgc2VydmVyLlxuICAgKiBAb3ZlcnJpZGVcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgc2VydmVyID0gcmVzdGlmeS5jcmVhdGVTZXJ2ZXIob3B0aW9ucyk7XG5cbiAgICAvLyBTZXQgZGVmYXVsdCBtaWRkbGV3YXJlXG4gICAgc2VydmVyLnVzZShyZXN0aWZ5LmJvZHlQYXJzZXIoe1xuICAgICAgLy8gVE9ETzogZXhwb3J0IGJlbG93IHBhcmFtcyB0byBleHRlcm5hbCBjb25maWd1YXRpb24gZmlsZVxuICAgICAgbWF4Qm9keVNpemU6IDBcbiAgICB9KSk7XG5cbiAgICAvLyBUT0RPOiBSU0EtU0hBMjU2IGlzIHRoZSByZWNvbW1lbmRhdGlvbi5cbiAgICAvLyBQYXJzZSBvbmx5IGlmIHRoZSBBdXRob3JpemF0aW9uIGhlYWRlciBpcyB0aGUgYmVhcmVyIEpXVCB0b2tlbi5cbiAgICBzZXJ2ZXIudXNlKGp3dCh7IHNlY3JldDogb3B0aW9ucy5zZWNyZXQgfSkpO1xuICAgIHNlcnZlci51c2Uoc2Vzc2lvbih7IHN0b3JlOiBvcHRpb25zLnN0b3JlIH0pKTtcblxuICAgIGlmIChvcHRpb25zLm1pZGRsZXdhcmVzKSB7XG4gICAgICBzZXJ2ZXIudXNlKG9wdGlvbnMubWlkZGxld2FyZXMpO1xuICAgIH1cblxuICAgIHRoaXMuX2FkYXB0ZWUgPSBzZXJ2ZXI7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiB0aGUgcmVzdGlmeSBzZXJ2ZXIuXG4gICAqIEBvdmVycmlkZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIHB1YmxpYyBsaXN0ZW4oKSB7XG4gICAgdmFyIGRlZmVycmVkID0gUHJvbWlzZS5kZWZlcjx2b2lkPigpO1xuICAgIHRoaXMuYWRhcHRlZS5saXN0ZW4odGhpcy5vcHRpb25zLnBvcnQsKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgIH0pO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG59XG5cbmV4cG9ydCA9IFJlc3RpZnlBZGFwdGVyOyJdfQ==
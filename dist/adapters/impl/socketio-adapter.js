var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../typings/tsd.d.ts" />
var io = require('socket.io');
var Promise = require('bluebird');
var ListenableAdapter = require('../listenable-adapter');
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
        this._adaptee = io();
        return Promise.resolve();
    };
    /**
     * @override
     * @returns {Promise<void>}
     */
    SocketIOAdapter.prototype.listen = function () {
        var deferred = Promise.defer();
        this.adaptee.listen(this.options.port, function (err) {
            if (err)
                return deferred.reject(err);
            deferred.resolve();
        });
        return deferred.promise;
    };
    return SocketIOAdapter;
})(ListenableAdapter);
module.exports = SocketIOAdapter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkYXB0ZXJzL2ltcGwvc29ja2V0aW8tYWRhcHRlci50cyJdLCJuYW1lcyI6WyJTb2NrZXRJT0FkYXB0ZXIiLCJTb2NrZXRJT0FkYXB0ZXIuY29uc3RydWN0b3IiLCJTb2NrZXRJT0FkYXB0ZXIuaW5pdGlhbGl6ZSIsIlNvY2tldElPQWRhcHRlci5saXN0ZW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLEFBQ0Esa0RBRGtEO0FBQ2xELElBQU8sRUFBRSxXQUFXLFdBQVcsQ0FBQyxDQUFDO0FBQ2pDLElBQU8sT0FBTyxXQUFXLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLElBQU8saUJBQWlCLFdBQVcsdUJBQXVCLENBQUMsQ0FBQztBQUc1RCxJQUFNLGVBQWU7SUFBU0EsVUFBeEJBLGVBQWVBLFVBQW1FQTtJQUF4RkEsU0FBTUEsZUFBZUE7UUFBU0MsOEJBQTBEQTtJQXVCeEZBLENBQUNBO0lBdEJDRDs7O09BR0dBO0lBQ0lBLG9DQUFVQSxHQUFqQkE7UUFDRUUsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBO1FBQ3JCQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFFREY7OztPQUdHQTtJQUNJQSxnQ0FBTUEsR0FBYkE7UUFDRUcsSUFBSUEsUUFBUUEsR0FBR0EsT0FBT0EsQ0FBQ0EsS0FBS0EsRUFBUUEsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLEVBQUNBLFVBQUNBLEdBQUdBO1lBQ3hDQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDckNBLFFBQVFBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO1FBQ3JCQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNIQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQTtJQUMxQkEsQ0FBQ0E7SUFDSEgsc0JBQUNBO0FBQURBLENBdkJBLEFBdUJDQSxFQXZCNkIsaUJBQWlCLEVBdUI5QztBQUVELEFBQXlCLGlCQUFoQixlQUFlLENBQUMiLCJmaWxlIjoiYWRhcHRlcnMvaW1wbC9zb2NrZXRpby1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy93b2tpbS9Qcm9qZWN0cy9ORlMvcmhvbWJ1cy9tZXRhL2JlL2V4dGVybmFscy9pc2xhbmQvIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuaW1wb3J0IGlvID0gcmVxdWlyZSgnc29ja2V0LmlvJyk7XG5pbXBvcnQgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5pbXBvcnQgTGlzdGVuYWJsZUFkYXB0ZXIgPSByZXF1aXJlKCcuLi9saXN0ZW5hYmxlLWFkYXB0ZXInKTtcbmltcG9ydCBTb2NrZXRJT0FkYXB0ZXJPcHRpb25zID0gcmVxdWlyZSgnLi4vLi4vb3B0aW9ucy9zb2NrZXRpby1hZGFwdGVyLW9wdGlvbnMnKTtcblxuY2xhc3MgU29ja2V0SU9BZGFwdGVyIGV4dGVuZHMgTGlzdGVuYWJsZUFkYXB0ZXI8U29ja2V0SU8uU2VydmVyLCBTb2NrZXRJT0FkYXB0ZXJPcHRpb25zPiB7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICogQG92ZXJyaWRlXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB0aGlzLl9hZGFwdGVlID0gaW8oKTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvKipcbiAgICogQG92ZXJyaWRlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgKi9cbiAgcHVibGljIGxpc3RlbigpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBQcm9taXNlLmRlZmVyPHZvaWQ+KCk7XG4gICAgdGhpcy5hZGFwdGVlLmxpc3Rlbih0aGlzLm9wdGlvbnMucG9ydCwoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbn1cblxuZXhwb3J0ID0gU29ja2V0SU9BZGFwdGVyOyJdfQ==
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../typings/tsd.d.ts" />
var mongoose = require('mongoose');
var Promise = require('bluebird');
var AbstractAdapter = require('../abstract-adapter');
/**
 * MongooseAdapter
 * @class
 * @extends AbstractAdapter
 */
var MongooseAdapter = (function (_super) {
    __extends(MongooseAdapter, _super);
    function MongooseAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * Initialize the mongoose connection.
     * @returns {Promise<void>}
     * @override
     */
    MongooseAdapter.prototype.initialize = function () {
        var _this = this;
        var options = this.options;
        var deferred = Promise.defer();
        // Mongoose buffers all the commands until it's connected to the database.
        // But make sure to the case of using a external mongodb connector
        var connection = mongoose.createConnection(options.uri, options.connectionOption);
        connection.once('open', function () {
            _this._adaptee = { connection: connection, schemaClass: mongoose.Schema };
            connection.removeAllListeners();
            deferred.resolve();
        });
        connection.once('error', function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
    return MongooseAdapter;
})(AbstractAdapter);
module.exports = MongooseAdapter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkYXB0ZXJzL2ltcGwvbW9uZ29vc2UtYWRhcHRlci50cyJdLCJuYW1lcyI6WyJNb25nb29zZUFkYXB0ZXIiLCJNb25nb29zZUFkYXB0ZXIuY29uc3RydWN0b3IiLCJNb25nb29zZUFkYXB0ZXIuaW5pdGlhbGl6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsQUFDQSxrREFEa0Q7QUFDbEQsSUFBTyxRQUFRLFdBQVcsVUFBVSxDQUFDLENBQUM7QUFDdEMsSUFBTyxPQUFPLFdBQVcsVUFBVSxDQUFDLENBQUM7QUFDckMsSUFBTyxlQUFlLFdBQVcscUJBQXFCLENBQUMsQ0FBQztBQUl4RCxBQUtBOzs7O0dBREc7SUFDRyxlQUFlO0lBQVNBLFVBQXhCQSxlQUFlQSxVQUFxRUE7SUFBMUZBLFNBQU1BLGVBQWVBO1FBQVNDLDhCQUE0REE7SUF1QjFGQSxDQUFDQTtJQXRCQ0Q7Ozs7T0FJR0E7SUFDSUEsb0NBQVVBLEdBQWpCQTtRQUFBRSxpQkFnQkNBO1FBZkNBLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBO1FBQzNCQSxJQUFJQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQSxLQUFLQSxFQUFRQSxDQUFDQTtRQUVyQ0EsQUFFQUEsMEVBRjBFQTtRQUMxRUEsa0VBQWtFQTtZQUM5REEsVUFBVUEsR0FBR0EsUUFBUUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxFQUFFQSxPQUFPQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO1FBQ2xGQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQTtZQUN0QkEsS0FBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsVUFBVUEsRUFBRUEsVUFBVUEsRUFBRUEsV0FBV0EsRUFBRUEsUUFBUUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7WUFDekVBLFVBQVVBLENBQUNBLGtCQUFrQkEsRUFBRUEsQ0FBQ0E7WUFDaENBLFFBQVFBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO1FBQ3JCQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNIQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxVQUFDQSxHQUFHQTtZQUMzQkEsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDdkJBLENBQUNBLENBQUNBLENBQUNBO1FBQ0hBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBO0lBQzFCQSxDQUFDQTtJQUNIRixzQkFBQ0E7QUFBREEsQ0F2QkEsQUF1QkNBLEVBdkI2QixlQUFlLEVBdUI1QztBQUVELEFBQXlCLGlCQUFoQixlQUFlLENBQUMiLCJmaWxlIjoiYWRhcHRlcnMvaW1wbC9tb25nb29zZS1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy93b2tpbS9Qcm9qZWN0cy9ORlMvcmhvbWJ1cy9tZXRhL2JlL2V4dGVybmFscy9pc2xhbmQvIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuaW1wb3J0IG1vbmdvb3NlID0gcmVxdWlyZSgnbW9uZ29vc2UnKTtcbmltcG9ydCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmltcG9ydCBBYnN0cmFjdEFkYXB0ZXIgPSByZXF1aXJlKCcuLi9hYnN0cmFjdC1hZGFwdGVyJyk7XG5pbXBvcnQgTW9uZ29vc2VBZGFwdGVyVHlwZSA9IHJlcXVpcmUoJy4vbW9uZ29vc2UtYWRhcHRlci10eXBlJyk7XG5pbXBvcnQgTW9uZ29vc2VBZGFwdGVyT3B0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL29wdGlvbnMvbW9uZ29vc2UtYWRhcHRlci1vcHRpb25zJyk7XG5cbi8qKlxuICogTW9uZ29vc2VBZGFwdGVyXG4gKiBAY2xhc3NcbiAqIEBleHRlbmRzIEFic3RyYWN0QWRhcHRlclxuICovXG5jbGFzcyBNb25nb29zZUFkYXB0ZXIgZXh0ZW5kcyBBYnN0cmFjdEFkYXB0ZXI8TW9uZ29vc2VBZGFwdGVyVHlwZSwgTW9uZ29vc2VBZGFwdGVyT3B0aW9ucz4ge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgbW9uZ29vc2UgY29ubmVjdGlvbi5cbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqIEBvdmVycmlkZVxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemUoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIGRlZmVycmVkID0gUHJvbWlzZS5kZWZlcjx2b2lkPigpO1xuXG4gICAgLy8gTW9uZ29vc2UgYnVmZmVycyBhbGwgdGhlIGNvbW1hbmRzIHVudGlsIGl0J3MgY29ubmVjdGVkIHRvIHRoZSBkYXRhYmFzZS5cbiAgICAvLyBCdXQgbWFrZSBzdXJlIHRvIHRoZSBjYXNlIG9mIHVzaW5nIGEgZXh0ZXJuYWwgbW9uZ29kYiBjb25uZWN0b3JcbiAgICB2YXIgY29ubmVjdGlvbiA9IG1vbmdvb3NlLmNyZWF0ZUNvbm5lY3Rpb24ob3B0aW9ucy51cmksIG9wdGlvbnMuY29ubmVjdGlvbk9wdGlvbik7XG4gICAgY29ubmVjdGlvbi5vbmNlKCdvcGVuJywgKCkgPT4ge1xuICAgICAgdGhpcy5fYWRhcHRlZSA9IHsgY29ubmVjdGlvbjogY29ubmVjdGlvbiwgc2NoZW1hQ2xhc3M6IG1vbmdvb3NlLlNjaGVtYSB9O1xuICAgICAgY29ubmVjdGlvbi5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICB9KTtcbiAgICBjb25uZWN0aW9uLm9uY2UoJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbn1cblxuZXhwb3J0ID0gTW9uZ29vc2VBZGFwdGVyOyJdfQ==
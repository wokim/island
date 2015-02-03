var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/tsd.d.ts" />
var Promise = require('bluebird');
var AbstractAdapter = require('./abstract-adapter');
/**
 * Abstract adapter class for back-end service.
 * @abstract
 * @class
 * @extends AbstractAdapter
 * @implements IListenableAdapter
 */
var ListenableAdapter = (function (_super) {
    __extends(ListenableAdapter, _super);
    function ListenableAdapter() {
        _super.apply(this, arguments);
        this._controllers = [];
    }
    /**
     * @param {AbstractController} Class
     */
    ListenableAdapter.prototype.registerController = function (Class) {
        this._controllers.push(Class);
    };
    /**
     * @returns {Promise<void>}
     * @final
     */
    ListenableAdapter.prototype.postInitialize = function () {
        while (this._controllers.length > 0) {
            var controller = this._controllers.pop();
            new controller(this._adaptee);
        }
    };
    /**
     * @abstract
     * @returns {Promise<void>}
     */
    ListenableAdapter.prototype.listen = function () {
        throw new Error('Not implemented error');
        return Promise.resolve();
    };
    return ListenableAdapter;
})(AbstractAdapter);
module.exports = ListenableAdapter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkYXB0ZXJzL2xpc3RlbmFibGUtYWRhcHRlci50cyJdLCJuYW1lcyI6WyJMaXN0ZW5hYmxlQWRhcHRlciIsIkxpc3RlbmFibGVBZGFwdGVyLmNvbnN0cnVjdG9yIiwiTGlzdGVuYWJsZUFkYXB0ZXIucmVnaXN0ZXJDb250cm9sbGVyIiwiTGlzdGVuYWJsZUFkYXB0ZXIucG9zdEluaXRpYWxpemUiLCJMaXN0ZW5hYmxlQWRhcHRlci5saXN0ZW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLEFBQ0EsK0NBRCtDO0FBQy9DLElBQU8sT0FBTyxXQUFXLFVBQVUsQ0FBQyxDQUFDO0FBRXJDLElBQU8sZUFBZSxXQUFXLG9CQUFvQixDQUFDLENBQUM7QUFHdkQsQUFPQTs7Ozs7O0dBREc7SUFDRyxpQkFBaUI7SUFBZUEsVUFBaENBLGlCQUFpQkEsVUFBb0NBO0lBQTNEQSxTQUFNQSxpQkFBaUJBO1FBQWVDLDhCQUFxQkE7UUFDakRBLGlCQUFZQSxHQUFnQ0EsRUFBRUEsQ0FBQ0E7SUE0QnpEQSxDQUFDQTtJQTFCQ0Q7O09BRUdBO0lBQ0lBLDhDQUFrQkEsR0FBekJBLFVBQTBCQSxLQUFnQ0E7UUFDeERFLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQ2hDQSxDQUFDQTtJQUVERjs7O09BR0dBO0lBQ0lBLDBDQUFjQSxHQUFyQkE7UUFDRUcsT0FBT0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDcENBLElBQUlBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ3pDQSxJQUFJQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFFREg7OztPQUdHQTtJQUNJQSxrQ0FBTUEsR0FBYkE7UUFDRUksTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxDQUFDQTtRQUN6Q0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBQ0hKLHdCQUFDQTtBQUFEQSxDQTdCQSxBQTZCQ0EsRUE3QnFDLGVBQWUsRUE2QnBEO0FBRUQsQUFBMkIsaUJBQWxCLGlCQUFpQixDQUFDIiwiZmlsZSI6ImFkYXB0ZXJzL2xpc3RlbmFibGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvd29raW0vUHJvamVjdHMvTkZTL3Job21idXMvbWV0YS9iZS9leHRlcm5hbHMvaXNsYW5kLyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cbmltcG9ydCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmltcG9ydCBJTGlzdGVuYWJsZUFkYXB0ZXIgPSByZXF1aXJlKCcuL2ludGVyZmFjZXMvbGlzdGVuYWJsZS1hZGFwdGVyLWludGVyZmFjZScpO1xuaW1wb3J0IEFic3RyYWN0QWRhcHRlciA9IHJlcXVpcmUoJy4vYWJzdHJhY3QtYWRhcHRlcicpO1xuaW1wb3J0IEFic3RyYWN0Q29udHJvbGxlciA9IHJlcXVpcmUoJy4uL2NvbnRyb2xsZXJzL2Fic3RyYWN0LWNvbnRyb2xsZXInKTtcblxuLyoqXG4gKiBBYnN0cmFjdCBhZGFwdGVyIGNsYXNzIGZvciBiYWNrLWVuZCBzZXJ2aWNlLlxuICogQGFic3RyYWN0XG4gKiBAY2xhc3NcbiAqIEBleHRlbmRzIEFic3RyYWN0QWRhcHRlclxuICogQGltcGxlbWVudHMgSUxpc3RlbmFibGVBZGFwdGVyXG4gKi9cbmNsYXNzIExpc3RlbmFibGVBZGFwdGVyPFQsIFU+IGV4dGVuZHMgQWJzdHJhY3RBZGFwdGVyPFQsIFU+IGltcGxlbWVudHMgSUxpc3RlbmFibGVBZGFwdGVyIHtcbiAgcHJpdmF0ZSBfY29udHJvbGxlcnM6IHR5cGVvZiBBYnN0cmFjdENvbnRyb2xsZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0Fic3RyYWN0Q29udHJvbGxlcn0gQ2xhc3NcbiAgICovXG4gIHB1YmxpYyByZWdpc3RlckNvbnRyb2xsZXIoQ2xhc3M6IHR5cGVvZiBBYnN0cmFjdENvbnRyb2xsZXIpIHtcbiAgICB0aGlzLl9jb250cm9sbGVycy5wdXNoKENsYXNzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICogQGZpbmFsXG4gICAqL1xuICBwdWJsaWMgcG9zdEluaXRpYWxpemUoKSB7XG4gICAgd2hpbGUgKHRoaXMuX2NvbnRyb2xsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBjb250cm9sbGVyID0gdGhpcy5fY29udHJvbGxlcnMucG9wKCk7XG4gICAgICBuZXcgY29udHJvbGxlcih0aGlzLl9hZGFwdGVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgKi9cbiAgcHVibGljIGxpc3RlbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCBlcnJvcicpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxufVxuXG5leHBvcnQgPSBMaXN0ZW5hYmxlQWRhcHRlcjsiXX0=
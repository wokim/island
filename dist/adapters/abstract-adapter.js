/// <reference path="../../typings/tsd.d.ts" />
var Promise = require('bluebird');
/**
 * Abstract adapter class for back-end service.
 * @abstract
 * @class
 * @implements IAbstractAdapter
 */
var AbstractAdapter = (function () {
    function AbstractAdapter(options) {
        this._options = options;
    }
    Object.defineProperty(AbstractAdapter.prototype, "adaptee", {
        get: function () {
            return this._adaptee;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractAdapter.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @abstract
     * @returns {Promise<any>}
     */
    AbstractAdapter.prototype.initialize = function () {
        throw new Error('Not implemented error');
        return Promise.resolve();
    };
    return AbstractAdapter;
})();
module.exports = AbstractAdapter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkYXB0ZXJzL2Fic3RyYWN0LWFkYXB0ZXIudHMiXSwibmFtZXMiOlsiQWJzdHJhY3RBZGFwdGVyIiwiQWJzdHJhY3RBZGFwdGVyLmNvbnN0cnVjdG9yIiwiQWJzdHJhY3RBZGFwdGVyLmFkYXB0ZWUiLCJBYnN0cmFjdEFkYXB0ZXIub3B0aW9ucyIsIkFic3RyYWN0QWRhcHRlci5pbml0aWFsaXplIl0sIm1hcHBpbmdzIjoiQUFBQSxBQUNBLCtDQUQrQztBQUMvQyxJQUFPLE9BQU8sV0FBVyxVQUFVLENBQUMsQ0FBQztBQUdyQyxBQU1BOzs7OztHQURHO0lBQ0csZUFBZTtJQU9uQkEsU0FQSUEsZUFBZUEsQ0FPUEEsT0FBV0E7UUFDckJDLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE9BQU9BLENBQUNBO0lBQzFCQSxDQUFDQTtJQUxERCxzQkFBV0Esb0NBQU9BO2FBQWxCQTtZQUEwQkUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFBQ0EsQ0FBQ0E7OztPQUFBRjtJQUNqREEsc0JBQWNBLG9DQUFPQTthQUFyQkE7WUFBNkJHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO1FBQUNBLENBQUNBOzs7T0FBQUg7SUFNcERBOzs7T0FHR0E7SUFDSUEsb0NBQVVBLEdBQWpCQTtRQUNFSSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSx1QkFBdUJBLENBQUNBLENBQUNBO1FBQ3pDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFDSEosc0JBQUNBO0FBQURBLENBbkJBLEFBbUJDQSxJQUFBO0FBRUQsQUFBeUIsaUJBQWhCLGVBQWUsQ0FBQyIsImZpbGUiOiJhZGFwdGVycy9hYnN0cmFjdC1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy93b2tpbS9Qcm9qZWN0cy9ORlMvcmhvbWJ1cy9tZXRhL2JlL2V4dGVybmFscy9pc2xhbmQvIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuaW1wb3J0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuaW1wb3J0IElBYnN0cmFjdEFkYXB0ZXIgPSByZXF1aXJlKCcuL2ludGVyZmFjZXMvYWJzdHJhY3QtYWRhcHRlci1pbnRlcmZhY2UnKTtcblxuLyoqXG4gKiBBYnN0cmFjdCBhZGFwdGVyIGNsYXNzIGZvciBiYWNrLWVuZCBzZXJ2aWNlLlxuICogQGFic3RyYWN0XG4gKiBAY2xhc3NcbiAqIEBpbXBsZW1lbnRzIElBYnN0cmFjdEFkYXB0ZXJcbiAqL1xuY2xhc3MgQWJzdHJhY3RBZGFwdGVyPFQsIFU+IGltcGxlbWVudHMgSUFic3RyYWN0QWRhcHRlciB7XG4gIHByb3RlY3RlZCBfYWRhcHRlZTogVDtcbiAgcHJvdGVjdGVkIF9vcHRpb25zOiBVO1xuXG4gIHB1YmxpYyBnZXQgYWRhcHRlZSgpOiBUIHsgcmV0dXJuIHRoaXMuX2FkYXB0ZWU7IH1cbiAgcHJvdGVjdGVkIGdldCBvcHRpb25zKCk6IFUgeyByZXR1cm4gdGhpcy5fb3B0aW9uczsgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBVKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCBlcnJvcicpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxufVxuXG5leHBvcnQgPSBBYnN0cmFjdEFkYXB0ZXI7Il19
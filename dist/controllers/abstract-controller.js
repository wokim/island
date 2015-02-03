/**
 * AbstractController<T>
 * @abstract
 * @class
 */
var AbstractController = (function () {
    /**
     * Connect your own controller here.
     * @constructs
     * @param {T} server
     */
    function AbstractController(server) {
        this._server = server;
        this.initialize();
    }
    Object.defineProperty(AbstractController.prototype, "server", {
        /**
         * @returns {T}
         */
        get: function () {
            return this._server;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @abstract
     */
    AbstractController.prototype.initialize = function () {
        throw new Error('Not implemented exception.');
    };
    return AbstractController;
})();
module.exports = AbstractController;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL2Fic3RyYWN0LWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsiQWJzdHJhY3RDb250cm9sbGVyIiwiQWJzdHJhY3RDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQWJzdHJhY3RDb250cm9sbGVyLnNlcnZlciIsIkFic3RyYWN0Q29udHJvbGxlci5pbml0aWFsaXplIl0sIm1hcHBpbmdzIjoiQUFBQSxBQUtBOzs7O0dBREc7SUFDRyxrQkFBa0I7SUFHdEJBOzs7O09BSUdBO0lBQ0hBLFNBUklBLGtCQUFrQkEsQ0FRVkEsTUFBU0E7UUFDbkJDLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE1BQU1BLENBQUNBO1FBQ3RCQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFLREQsc0JBQWNBLHNDQUFNQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBQXlCRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUFDQSxDQUFDQTs7O09BQUFGO0lBRS9DQTs7T0FFR0E7SUFDT0EsdUNBQVVBLEdBQXBCQTtRQUNFRyxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSw0QkFBNEJBLENBQUNBLENBQUNBO0lBQ2hEQSxDQUFDQTtJQUNISCx5QkFBQ0E7QUFBREEsQ0F4QkEsQUF3QkNBLElBQUE7QUFFRCxBQUE0QixpQkFBbkIsa0JBQWtCLENBQUMiLCJmaWxlIjoiY29udHJvbGxlcnMvYWJzdHJhY3QtY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvd29raW0vUHJvamVjdHMvTkZTL3Job21idXMvbWV0YS9iZS9leHRlcm5hbHMvaXNsYW5kLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQWJzdHJhY3RDb250cm9sbGVyPFQ+XG4gKiBAYWJzdHJhY3RcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBBYnN0cmFjdENvbnRyb2xsZXI8VD4ge1xuICBwcml2YXRlIF9zZXJ2ZXI6IFQ7XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgeW91ciBvd24gY29udHJvbGxlciBoZXJlLlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1R9IHNlcnZlclxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VydmVyOiBUKSB7XG4gICAgdGhpcy5fc2VydmVyID0gc2VydmVyO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtUfVxuICAgKi9cbiAgcHJvdGVjdGVkIGdldCBzZXJ2ZXIoKSB7IHJldHVybiB0aGlzLl9zZXJ2ZXI7IH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCBleGNlcHRpb24uJyk7XG4gIH1cbn1cblxuZXhwb3J0ID0gQWJzdHJhY3RDb250cm9sbGVyOyJdfQ==
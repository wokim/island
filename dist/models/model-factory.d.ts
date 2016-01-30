/**
 * ModelFactory
 * @class
 */
export default class ModelFactory {
    private static models;
    /**
     * Retrieves the model of given type.
     * @param {any} Class
     * @returns {any}
     */
    static get<T>(Class: any): T;
    static get(Class: any): any;
}

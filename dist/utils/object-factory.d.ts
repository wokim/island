import ObjectWrapper from './object-wrapper';
/**
 * ModelFactory
 * @class
 */
export default class ObjectFactory {
    private static models;
    /**
     * Retrieves the wrapped object of given wrapper.
     * @param {typeof ObjectWrapper} Class
     * @returns {T}
     */
    static get<T>(Class: typeof ObjectWrapper): T;
}

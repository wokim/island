import StaticDataLoader from './staticdata-loader';
/**
 * ModelFactory
 * @class
 */
export default class StaticDataFactory {
    private static staticData;
    /**
     * Retrieves the wrapped static-data object of given loader.
     *
     * @param Class
     * @returns {any}
     */
    static get<T>(Class: typeof StaticDataLoader): T;
}

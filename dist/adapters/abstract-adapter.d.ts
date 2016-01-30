import Promise = require('bluebird');
/**
 * IAbstractAdapter
 * @interface
 */
export interface IAbstractAdapter {
    adaptee: any;
    initialize(): Promise<void>;
}
/**
 * Abstract adapter class for back-end service.
 * @abstract
 * @class
 * @implements IAbstractAdapter
 */
export default class AbstractAdapter<T, U> implements IAbstractAdapter {
    protected _adaptee: T;
    protected _options: U;
    adaptee: T;
    protected options: U;
    constructor(options?: U);
    /**
     * @abstract
     * @returns {Promise<any>}
     */
    initialize(): Promise<void>;
}

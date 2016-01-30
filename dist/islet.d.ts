import Promise = require('bluebird');
import { IAbstractAdapter } from './adapters/abstract-adapter';
/**
 * Create a new Islet.
 * @abstract
 * @class
 */
export default class Islet {
    private static islet;
    /**
     * Register the islet which is the suite of micro-service
     * @param {Islet} islet
     * @static
     */
    private static registerIslet(islet);
    /**
     * Retrieves a registered micro-service.
     * @returns {Microservice}
     * @static
     */
    static getIslet(): Islet;
    static getIslet<T>(): T;
    /**
     * Instantiate and run a microservice.
     * @param {Microservice} Class
     * @static
     */
    static run(Class: typeof Islet): Promise<any[]>;
    /** @type {Object.<string, IAbstractAdapter>} [adapters={}] */
    private adapters;
    /**
     * Register the adapter.
     * @param {string} name
     * @param {IAbstractAdapter} adapter
     */
    registerAdapter(name: string, adapter: IAbstractAdapter): void;
    /**
     * @param {string} name
     * @returns {typeof Adapter}
     */
    getAdaptee<T>(name: string): T;
    getAdaptee(name: string): any;
    /**
     * @abstract
     */
    main(): void;
    /**
     * @returns {Promise<void>}
     */
    initialize(): Promise<void>;
    protected onInitialized(): void;
    protected onDestroy(): void;
    /**
     * @returns {Promise<void>}
     */
    start(): Promise<void[]>;
    destroy(): Promise<void>;
}

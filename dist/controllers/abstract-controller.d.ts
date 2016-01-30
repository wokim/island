import * as Promise from 'bluebird';
/**
 * AbstractController<T>
 * @abstract
 * @class
 */
export default class AbstractController<T> {
    private _server;
    /**
     * Connect your own controller here.
     * @constructs
     * @param {T} server
     */
    constructor(server: T);
    /**
     * @returns {T}
     */
    protected server: T;
    /**
     * @abstract
     * @returns {Promise<void>}
     */
    initialize(): any | Promise<any>;
    onInitialized(): any | Promise<any>;
    onDestroy(): any | Promise<any>;
}

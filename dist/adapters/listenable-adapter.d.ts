import Promise = require('bluebird');
import AbstractAdapter, { IAbstractAdapter } from './abstract-adapter';
import AbstractController from '../controllers/abstract-controller';
/**
 * IListenableAdapter
 * @interface
 */
export interface IListenableAdapter extends IAbstractAdapter {
    listen(): Promise<void>;
}
/**
 * Abstract adapter class for back-end service.
 * @abstract
 * @class
 * @extends AbstractAdapter
 * @implements IListenableAdapter
 */
export default class ListenableAdapter<T, U> extends AbstractAdapter<T, U> implements IListenableAdapter {
    private _controllersClasses;
    private _controllers;
    /**
     * @param {AbstractController} Class
     */
    registerController(Class: typeof AbstractController): void;
    /**
     * @returns {Promise<void>}
     * @final
     */
    postInitialize(): Promise<any>;
    /**
     * @abstract
     * @returns {Promise<void>}
     */
    listen(): Promise<void>;
    destroy(): Promise<void>;
    close(): Promise<void>;
}

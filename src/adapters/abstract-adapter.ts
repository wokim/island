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

  public get adaptee(): T { return this._adaptee; }
  protected get options(): U { return this._options; }

  constructor(options?: U) {
    this._options = options;
  }

  /**
   * @abstract
   * @returns {Promise<any>}
   */
  public initialize() {
    throw new Error('Not implemented error');
    return Promise.resolve();
  }
}

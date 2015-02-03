/// <reference path="../../typings/tsd.d.ts" />
import Promise = require('bluebird');
import IAbstractAdapter = require('./interfaces/abstract-adapter-interface');

/**
 * Abstract adapter class for back-end service.
 * @abstract
 * @class
 * @implements IAbstractAdapter
 */
class AbstractAdapter<T, U> implements IAbstractAdapter {
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

export = AbstractAdapter;
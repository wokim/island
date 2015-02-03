/// <reference path="../../typings/tsd.d.ts" />
import Promise = require('bluebird');
import IListenableAdapter = require('./interfaces/listenable-adapter-interface');
import AbstractAdapter = require('./abstract-adapter');
import AbstractController = require('../controllers/abstract-controller');

/**
 * Abstract adapter class for back-end service.
 * @abstract
 * @class
 * @extends AbstractAdapter
 * @implements IListenableAdapter
 */
class ListenableAdapter<T, U> extends AbstractAdapter<T, U> implements IListenableAdapter {
  private _controllers: typeof AbstractController[] = [];

  /**
   * @param {AbstractController} Class
   */
  public registerController(Class: typeof AbstractController) {
    this._controllers.push(Class);
  }

  /**
   * @returns {Promise<void>}
   * @final
   */
  public postInitialize() {
    while (this._controllers.length > 0) {
      var controller = this._controllers.pop();
      new controller(this._adaptee);
    }
  }

  /**
   * @abstract
   * @returns {Promise<void>}
   */
  public listen() {
    throw new Error('Not implemented error');
    return Promise.resolve();
  }
}

export = ListenableAdapter;
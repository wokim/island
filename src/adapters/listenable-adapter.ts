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
  private _controllersClasses: typeof AbstractController[] = [];
  private _controllers: AbstractController<T>[] = [];

  /**
   * @param {AbstractController} Class
   */
  public registerController(Class: typeof AbstractController) {
    this._controllersClasses.push(Class);
  }

  /**
   * @returns {Promise<void>}
   * @final
   */
  public postInitialize(): Promise<any> {
    return Promise.all(this._controllersClasses.map(ControllerClass => {
      let c = new ControllerClass(this._adaptee);
      this._controllers.push(c);
      return Promise.try(() => c.initialize()).then(() => c.onInitialized());
    }));
  }

  /**
   * @abstract
   * @returns {Promise<void>}
   */
  public listen() {
    throw new Error('Not implemented error');
    return Promise.resolve();
  }

  public destroy() {
    return Promise.all(this._controllers.map(c => Promise.try(() => c.onDestroy()))).then(() => {
      this._controllersClasses = [];
      this._controllers = [];
    });
  }

  public close() {
    return Promise.resolve();
  }
}

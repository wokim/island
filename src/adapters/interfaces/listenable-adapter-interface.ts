import IAbstractAdapter = require('./abstract-adapter-interface');
import AbstractController = require('../../controllers/abstract-controller');

/**
 * IListenableAdapter
 * @interface
 */
interface IListenableAdapter extends IAbstractAdapter {
  listen(): Promise<void>;
}

export = IListenableAdapter;
/// <reference path="../../../typings/tsd.d.ts" />
import Promise = require('bluebird');

/**
 * IAbstractAdapter
 * @interface
 */
interface IAbstractAdapter {
  adaptee: any;
  initialize(): Promise<void>;
}

export = IAbstractAdapter;
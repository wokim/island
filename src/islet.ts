import _ = require('lodash');
import fs = require('fs');
import Promise = require('bluebird');
import { IAbstractAdapter } from './adapters/abstract-adapter';
import ListenableAdapter from './adapters/listenable-adapter';

var debug = require('debug')('ISLAND:ISLET');

/**
 * Create a new Islet.
 * @abstract
 * @class
 */
export default class Islet {
  private static islet: Islet;

  /**
   * Register the islet which is the suite of micro-service
   * @param {Islet} islet
   * @static
   */
  private static registerIslet(islet: Islet) {
    if (Islet.islet) throw new Error('The islet already has been registered.');
    Islet.islet = islet;
  }

  /**
   * Retrieves a registered micro-service.
   * @returns {Microservice}
   * @static
   */
  public static getIslet(): Islet;
  public static getIslet<T>(): T;
  public static getIslet(): any {
    return Islet.islet;
  }

  /**
   * Instantiate and run a microservice.
   * @param {Microservice} Class
   * @static
   */
  public static run(Class: typeof Islet): Promise<any[]> {
    if (this.islet) return;

    var Class: typeof Islet;
    var config: Promise<any>;

    // Create such a micro-service instance.
    var islet = new Class();
    this.registerIslet(islet);

    islet.main();
    return islet.initialize().then(() => islet.start());
  }

  /** @type {Object.<string, IAbstractAdapter>} [adapters={}] */
  private adapters: { [name: string]: IAbstractAdapter; } = {};

  /**
   * Register the adapter.
   * @param {string} name
   * @param {IAbstractAdapter} adapter
   */
  public registerAdapter(name: string, adapter: IAbstractAdapter) {
    if (this.adapters[name]) throw new Error('duplicated adapter');
    this.adapters[name] = adapter;
  }

  /**
   * @param {string} name
   * @returns {typeof Adapter}
   */
  public getAdaptee<T>(name: string): T;
  public getAdaptee(name: string): any;
  public getAdaptee(name: string): any {
    if (!this.adapters[name]) throw new Error('Missing adapter');
    return this.adapters[name].adaptee;
  }

  /**
   * @abstract
   */
  public main() {
    throw new Error('Not implemented exception.');
  }

  /**
   * @returns {Promise<void>}
   */
  public initialize() {
    return Promise.all(_.values<IAbstractAdapter>(this.adapters).map(adapter => adapter.initialize())).then(() => {
      // 모든 adapter가 초기화되면 onInitialize() 를 호출해준다
      return Promise.resolve(this.onInitialized());
    });
  }

  protected onInitialized() {}
  protected onDestroy() {}

  /**
   * @returns {Promise<void>}
   */
  public start() {
    var adapters: any/*ListenableAdapter<any, any>*/[] = _.values(this.adapters).filter(adapter => {
      return adapter instanceof ListenableAdapter;
    });

    // Initialize all of the adapters to register resource into routing table.
    return Promise.all<void>(adapters.map(adapter => adapter.postInitialize()))
      .then(() => Promise.all<void>(adapters.map(adapter => adapter.listen())));
  }

  public destroy() {
    // TODO: 각 adapter의 destroy 호출해준다
    let adapters: any[] = _.values(this.adapters).filter(adapter => (adapter instanceof ListenableAdapter));
    return Promise.all(adapters.map(adapter => adapter.close().then(() => adapter.destroy()))).then(() => this.onDestroy())
  }
}

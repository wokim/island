import * as _ from 'lodash';

import { IAbstractAdapter } from './adapters/abstract-adapter';
import ListenableAdapter, { IListenableAdapter } from './adapters/listenable-adapter';
import { logger } from './utils/logger';
import { bindImpliedServices } from './utils/di-bind';
import { FatalError, ISLAND } from './utils/error';

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
    if (Islet.islet) throw new FatalError(ISLAND.FATAL.F0001_ISLET_ALREADY_HAS_BEEN_REGISTERED, 'The islet already has been registered.');
    Islet.islet = islet;
  }

  /**
   * Retrieves a registered micro-service.
   * @returns {Microservice}
   * @static
   */
  static getIslet(): Islet {
    return Islet.islet;
  }

  /**
   * Instantiate and run a microservice.
   * @param {Microservice} Class
   * @static
   */
  public static run(Class: typeof Islet) {
    if (this.islet) return;

    // Create such a micro-service instance.
    const islet = new Class();
    this.registerIslet(islet);

    islet.main();
    return islet.initialize();
  }

  /** @type {Object.<string, IAbstractAdapter>} [adapters={}] */
  private adapters: { [name: string]: IAbstractAdapter; } = {};

  /**
   * Register the adapter.
   * @param {string} name
   * @param {IAbstractAdapter} adapter
   */
  public registerAdapter(name: string, adapter: IAbstractAdapter) {
    if (this.adapters[name]) throw new FatalError(ISLAND.FATAL.F0002_DUPLICATED_ADAPTER, 'duplicated adapter');
    this.adapters[name] = adapter;
  }

  /**
   * @param {string} name
   * @returns {typeof Adapter}
   */
  public getAdaptee<T>(name: string): T {
    if (!this.adapters[name]) throw new FatalError(ISLAND.FATAL.F0003_MISSING_ADAPTER, 'Missing adapter');
    return this.adapters[name].adaptee as T;
  }

  /**
   * @abstract
   */
  public main() {
    throw new FatalError(ISLAND.FATAL.F0004_NOT_IMPLEMENTED_ERROR, 'Not implemented exception.');
  }

  /**
   * @returns {Promise<void>}
   */
  private async initialize() {
    try {
      await this.onPrepare();
      await Promise.all(_.values<IAbstractAdapter>(this.adapters).map(adapter => adapter.initialize()));
      process.once('SIGTERM', this.destroy.bind(this));
      bindImpliedServices(this.adapters);
      await this.onInitialized();
      const adapters = _.values<IListenableAdapter>(this.adapters).filter(adapter => adapter instanceof ListenableAdapter);
      
      await Promise.all(adapters.map(adapter => adapter.postInitialize()));
      await Promise.all(adapters.map(adapter => adapter.listen()));
        
      logger.info('started');
      await this.onStarted();
    } catch(e) {
      console.log('failed to initialize', e);
      process.exit(1);
    };
  }

  protected onPrepare() {}
  protected onInitialized() {}
  protected onDestroy() {}
  protected onStarted() {}

  private async destroy() {
    logger.info('Waiting for process to end');
    await Promise.all(_.values<IAbstractAdapter>(this.adapters).map(adapter => adapter.destroy()));
    this.onDestroy();
  }
}

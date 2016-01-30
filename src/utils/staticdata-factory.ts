import StaticDataLoader from './staticdata-loader';

/**
 * ModelFactory
 * @class
 */
export default class StaticDataFactory {
  private static staticData: { [name: string]: any } = {};

  /**
   * Retrieves the wrapped static-data object of given loader.
   *
   * @param Class
   * @returns {any}
   */
  public static get<T>(Class: typeof StaticDataLoader) {
    var name: string = (<any>Class.prototype.constructor).name;
    var instance = <StaticDataLoader<T>>this.staticData[name];

    if (!instance) {
      this.staticData[name] = instance = new Class<T>();
      instance.initialize();
    }
    return instance.Object;
  }
}
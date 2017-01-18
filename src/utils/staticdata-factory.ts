import StaticDataLoader from './staticdata-loader';

/**
 * ModelFactory
 * @class
 */
export default class StaticDataFactory {
  /**
   * Retrieves the wrapped static-data object of given loader.
   *
   * @param Class
   * @returns {any}
   */
  public static get<T>(subClass: typeof StaticDataLoader) {
    const name: string = (subClass.prototype.constructor as any).name;
    let instance = this.staticData[name] as StaticDataLoader<T>;

    if (!instance) {
      this.staticData[name] = instance = new subClass<T>();
      instance.initialize();
    }
    return instance.Object;
  }

  private static staticData: { [name: string]: any } = {};
}

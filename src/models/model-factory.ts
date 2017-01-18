/**
 * ModelFactory
 * @class
 * @deprecated
 */
export default class ModelFactory {
  /**
   * Retrieves the model of given type.
   * @param {any} Class
   * @returns {any}
   */
  public static get<T>(subClass: any): T;
  public static get(subClass: any): any;
  public static get(subClass: any): any {
    const name: string = (subClass.prototype.constructor as any).name;
    let instance = this.models[name];
    if (!instance) {
      this.models[name] = instance = new subClass();
      return instance;
    }
    return instance;
  }

  private static models: { [name: string]: any } = {};
}

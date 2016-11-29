/**
 * ModelFactory
 * @class
 * @deprecated
 */
export default class ModelFactory {
  private static models: { [name: string]: any } = {};

  /**
   * Retrieves the model of given type.
   * @param {any} Class
   * @returns {any}
   */
  public static get<T>(Class: any): T;
  public static get(Class: any): any;
  public static get(Class: any): any {
    const name: string = (<any>Class.prototype.constructor).name;
    let instance = this.models[name];
    if (!instance) {
      this.models[name] = instance = new Class();
      return instance;
    }
    return instance;
  }
}
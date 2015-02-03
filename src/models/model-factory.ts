/**
 * ModelFactory
 * @class
 */
class ModelFactory {
  private static models: { [name: string]: any } = {};

  /**
   * Retrieves the model of given type.
   * @param {any} Class
   * @returns {any}
   */
  public static get<T>(Class: any): T;
  public static get(Class: any): any;
  public static get(Class: any): any {
    var name: string = (<any>Class.prototype.constructor).name;
    var instance = this.models[name];
    if (!instance) {
      this.models[name] = instance = new Class();
      return instance;
    }
    return instance;
  }
}

export = ModelFactory;
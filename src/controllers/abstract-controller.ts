/**
 * AbstractController<T>
 * @abstract
 * @class
 */
class AbstractController<T> {
  private _server: T;

  /**
   * Connect your own controller here.
   * @constructs
   * @param {T} server
   */
  constructor(server: T) {
    this._server = server;
    this.initialize();
  }

  /**
   * @returns {T}
   */
  protected get server() { return this._server; }

  /**
   * @abstract
   */
  protected initialize() {
    throw new Error('Not implemented exception.');
  }
}

export = AbstractController;
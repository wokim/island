import io = require('socket.io');
import Promise = require('bluebird');
import ListenableAdapter from '../listenable-adapter';

export interface SocketIOAdapterOptions {
  port: number;
}

export default class SocketIOAdapter extends ListenableAdapter<SocketIO.Server, SocketIOAdapterOptions> {
  /**
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    var options = this.options;
    this._adaptee = io({ transports: ['websocket', 'polling', 'flashsocket'] });
    return Promise.resolve();
  }

  /**
   * @override
   * @returns {Promise<void>}
   */
  public listen() {
    this.adaptee.listen(this.options.port);
    return Promise.resolve();
  }
}

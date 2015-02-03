/// <reference path="../../../typings/tsd.d.ts" />
import io = require('socket.io');
import Promise = require('bluebird');
import ListenableAdapter = require('../listenable-adapter');
import SocketIOAdapterOptions = require('../../options/socketio-adapter-options');

class SocketIOAdapter extends ListenableAdapter<SocketIO.Server, SocketIOAdapterOptions> {
  /**
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    var options = this.options;
    this._adaptee = io();
    return Promise.resolve();
  }

  /**
   * @override
   * @returns {Promise<void>}
   */
  public listen() {
    var deferred = Promise.defer<void>();
    this.adaptee.listen(this.options.port,(err) => {
      if (err) return deferred.reject(err);
      deferred.resolve();
    });
    return deferred.promise;
  }
}

export = SocketIOAdapter;
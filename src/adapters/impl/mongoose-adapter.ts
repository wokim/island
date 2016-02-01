import mongoose = require('mongoose');
import Promise = require('bluebird');
import AbstractAdapter from '../abstract-adapter';

export interface MongooseAdapterOptions {
  uri: string;
  connectionOptions?: mongoose.ConnectionOptions;
}

/**
 * MongooseAdapter
 * @class
 * @extends AbstractAdapter
 */
export default class MongooseAdapter extends AbstractAdapter<mongoose.Connection, MongooseAdapterOptions> {
  /**
   * Initialize the mongoose connection.
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    var options = this.options;
    var deferred = Promise.defer<void>();

    // Mongoose buffers all the commands until it's connected to the database.
    // But make sure to the case of using a external mongodb connector
    var connection = mongoose.createConnection(options.uri, options.connectionOptions);
    connection.once('open', () => {
      this._adaptee = connection;
      connection.removeAllListeners();
      deferred.resolve();
    });
    connection.once('error', (err) => {
      deferred.reject(err);
    });
    return deferred.promise;
  }
}

/// <reference path="../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');
import Promise = require('bluebird');
import AbstractAdapter = require('../abstract-adapter');
import MongooseAdapterType = require('./mongoose-adapter-type');
import MongooseAdapterOptions = require('../../options/mongoose-adapter-options');

/**
 * MongooseAdapter
 * @class
 * @extends AbstractAdapter
 */
class MongooseAdapter extends AbstractAdapter<MongooseAdapterType, MongooseAdapterOptions> {
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
    var connection = mongoose.createConnection(options.uri, options.connectionOption);
    connection.once('open', () => {
      this._adaptee = { connection: connection, schemaClass: mongoose.Schema };
      connection.removeAllListeners();
      deferred.resolve();
    });
    connection.once('error', (err) => {
      deferred.reject(err);
    });
    return deferred.promise;
  }
}

export = MongooseAdapter;
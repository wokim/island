/// <reference path="../../../typings/tsd.d.ts" />
import redis = require('redis');
import Promise = require('bluebird');
import AbstractAdapter = require('../abstract-adapter');
import RedisAdapterOptions = require('../../options/redis-adapter-options');

/**
 * RedisConnectionAdapter
 * @class
 * @extends AbstractAdapter
 */
class RedisConnectionAdapter extends AbstractAdapter<redis.RedisClient, RedisAdapterOptions> {
  /**
   * Initialize the redis connection.
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    var options = this.options;
    var deferred = Promise.defer<void>();
    var client = redis.createClient(options.port, options.host, options.clientOpts);

    // Although all commands before the connection are accumulated in the queue,
    // Make sure for the case of using a external redis connector.
    client.once('connect', () => {
      this._adaptee = client;
      client.removeAllListeners();
      deferred.resolve();
    });
    client.once('error', err => {
      deferred.reject(err);
    });
    return deferred.promise;
  }
}

export = RedisConnectionAdapter;
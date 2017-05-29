import Promise = require('bluebird');
import redis = require('redis-bluebird');

import { FatalError, ISLAND } from '../../utils/error';
import AbstractAdapter from '../abstract-adapter';

export interface RedisAdapterOptions {
  port: number;
  host: string;
  clientOpts?: redis.ClientOpts;
}

/**
 * RedisConnectionAdapter
 * @class
 * @extends AbstractAdapter
 */
export default class RedisConnectionAdapter extends AbstractAdapter<redis.RedisClient, RedisAdapterOptions> {
  /**
   * Initialize the redis connection.
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    if (!this.options) throw new FatalError(ISLAND.FATAL.F0025_MISSING_ADAPTER_OPTIONS);
    const options = this.options;

    return new Promise<void>((resolve, reject) => {
      const client = redis.createClient(options.port, options.host, options.clientOpts);

      // Although all commands before the connection are accumulated in the queue,
      // Make sure for the case of using a external redis connector.
      client.once('ready', () => {
        this._adaptee = client;
        client.removeAllListeners();
        resolve();
      });
      client.once('error', err => {
        reject(err);
      });
    });
  }

  public destroy() {
    return this._adaptee.quit();
  }
}

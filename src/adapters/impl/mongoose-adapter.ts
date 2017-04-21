import * as Bluebird from 'bluebird';
import * as dns from 'dns';
import * as mongodbUri from 'mongodb-uri';
import * as mongoose from 'mongoose';

import { FatalError, ISLAND } from '../../utils/error';
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
    return new Promise<void>((resolve, reject) => {
      if (!this.options) throw new FatalError(ISLAND.FATAL.F0025_MISSING_ADAPTER_OPTIONS);
      // Mongoose buffers all the commands until it's connected to the database.
      // But make sure to the case of using a external mongodb connector
      const uri = this.options.uri;
      const connectionOptions = this.options.connectionOptions;
      this.dnsLookup(uri).then(address => {
        const connection = mongoose.createConnection(address, connectionOptions);
        connection.once('open', () => {
          this._adaptee = connection;
          connection.removeAllListeners();
          resolve();
        });
        connection.once('error', err => {
          reject(err);
        });
      });
    });
  }

  public destroy() {}

  private async dnsLookup(uri) {
    const h = mongodbUri.parse(uri);
    return Bluebird.map(h.hosts, (async (host: {host: string}) => {
      await this.convert(host.host).then((ip: string) => { host.host = ip; });
    })).then(() => {
      const address = mongodbUri.format(h);
      return address;
    });
  }

  private async convert(host) {
    return await new Promise((resolve, reject) => {
      dns.lookup(host, (err, ip) => {
        if (err) return reject(err);
        return resolve(ip);
      });
    });
  }
}

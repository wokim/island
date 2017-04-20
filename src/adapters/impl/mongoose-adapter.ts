import * as dns from 'dns';
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
      return new Promise((resolve, reject) => {
        this.dnsLookup(uri)
        .then(address => {
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
    });
  }

  public destroy() {}

  private async dnsLookup(uri) {
    let address = 'mongodb://';
    let h = uri.split(address)[1];
    if (h.indexOf('@') > -1) {
      address += h.split('@')[0] + '@';
      h = h.split('@')[1];
    }
    address += 'HOST';
    const host = h.split(':')[0];
    if (h.split(':')[1]) {
      address += ':' + h.split(':')[1];
    }
    // tslint:disable-next-line
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(host)) {
      return uri;
    }
    return await new Promise((resolve, reject) => {
      dns.lookup(host, (err, ip) => {
        if (err) return reject(err);
        address = address.replace('HOST', ip);
        return resolve(address);
      });
    });
  }
}

import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');
import ListenableAdapter from '../listenable-adapter';

export interface RabbitMqAdapterOptions {
  url: string;
  serviceName?: string;
  socketOptions?: amqp.SocketOptions;
  rpcTimeout?: number;
}

export default class RabbitMqAdapter<T> extends ListenableAdapter<T, RabbitMqAdapterOptions> {
  protected connection: amqp.Connection;
  /**
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    var options = this.options;
    var deferred = Promise.defer<void>();
    amqp.connect(options.url, options.socketOptions, (err, connection) => {
      if (err) return deferred.reject(err);
      this.connection = connection;
      // TODO: reconnect process
      process.once('SIGINT',() => { connection.close(); });
      deferred.resolve();
    });
    return deferred.promise;
  }

  public listen() {
    return Promise.resolve();
  }
}

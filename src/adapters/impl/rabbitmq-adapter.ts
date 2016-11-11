import * as amqp from 'amqplib';
import ListenableAdapter from '../listenable-adapter';
import { FatalError, ISLAND } from '../../utils/error';

export interface RabbitMqAdapterOptions {
  url: string;
  serviceName?: string;
  socketOptions?: {heartbeat?: number, noDelay: boolean};
  rpcTimeout?: number;
}

export default class RabbitMqAdapter<T> extends ListenableAdapter<T, RabbitMqAdapterOptions> {
  protected connection: amqp.Connection;
  /**
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    if (!this.options) throw new FatalError(ISLAND.FATAL.F0025_MISSING_ADAPTER_OPTIONS);
    const options = this.options;
    return Promise.resolve(amqp.connect(options.url, options.socketOptions))
      .then(connection => {
        this.connection = connection
      });
  }

  public listen() {
    return Promise.resolve();
  }
}

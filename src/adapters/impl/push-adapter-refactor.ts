'use strict';

import amqp = require('amqplib');
import Promise = require('bluebird');
import ListenableAdapter from '../listenable-adapter';
import PushService from '../../services/push-service-refactor';
import {RabbitMqAdapterOptions} from './rabbitmq-adapter';

export default class PushAdapter extends ListenableAdapter<PushService, RabbitMqAdapterOptions> {

  protected connection: amqp.Connection;

  public initialize(): Promise<any> {
    var options = this.options;
    return Promise.resolve(amqp.connect(options.url, options.socketOptions))
      .then(connection => {
        this.connection = connection;
        process.once('SIGINT',() => { connection.close(); });
        this._adaptee = new PushService(this.connection);
        return this._adaptee.initialize();
      });
  }

  public listen(): Promise<void> {
    return Promise.resolve();
  }
}

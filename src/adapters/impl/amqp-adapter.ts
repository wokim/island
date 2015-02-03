/// <reference path="../../../typings/tsd.d.ts" />
import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');
import AbstractAdapter = require('../abstract-adapter');
import AMQPAdapterOptions = require('../../options/amqp-adapter-options');

class AMQPAdapter extends AbstractAdapter<amqp.Channel, AMQPAdapterOptions> {
  /**
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    var options = this.options;
    var deferred = Promise.defer<void>();
    amqp.connect(options.url, options.socketOptions, (err, conn) => {
      if (err) return deferred.reject(err);
      conn.createChannel((err, ch) => {
        if (err) return deferred.reject(err);
        this._adaptee = ch;
        deferred.resolve();
      });
    });
    return deferred.promise;
  }
}

export = AMQPAdapter;
/// <reference path="../../typings/tsd.d.ts" />
import amqp = require('amqplib/callback_api');

interface AMQPAdapterOptions {
  url: string;
  socketOptions?: amqp.SocketOptions;
}

export = AMQPAdapterOptions;
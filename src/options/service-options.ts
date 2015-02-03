import MongooseAdapterOptions = require('./mongoose-adapter-options');
import RedisAdapterOptions = require('./redis-adapter-options');
import RestifyAdapterOptions = require('./restify-adapter-options');
import AMQPAdapterOptions = require('./amqp-adapter-options');
import SocketIOAdapterOptions = require('./socketio-adapter-options');

/**
 * ServiceOptions
 * @interface
 */
interface ServiceOptions {
  mongoose?: MongooseAdapterOptions;
  redis?: RedisAdapterOptions;
  restify?: RestifyAdapterOptions;
  amqp?: AMQPAdapterOptions;
  socketio?: SocketIOAdapterOptions;
}

export = ServiceOptions;
require('source-map-support').install();

export import mongoose = require('mongoose');


import * as _debug from 'debug';

export function debug(namespace) {
  return _debug('[' + namespace + ']');
}

export function error(namespace) {
  var d = _debug('[' + namespace + ']');
  d.log = console.error.bind(console);
  return d;
}

import Islet from './islet';
export { Islet };

// adapters
export { default as AbstractAdapter } from './adapters/abstract-adapter';
export { default as ListenableAdapter } from './adapters/listenable-adapter';

// adapters/impl
export { default as MessageBrokerAdapter } from './adapters/impl/message-broker-adapter';
export { default as MongooseAdapter } from './adapters/impl/mongoose-adapter';
export { default as PushAdapter } from './adapters/impl/push-adapter-refactor';
export { default as RedisConnectionAdapter } from './adapters/impl/redis-connection-adapter';
export { default as RestifyAdapter } from './adapters/impl/restify-adapter';
export { default as RPCAdapter } from './adapters/impl/rpc-adapter';
export { default as SocketIOAdapter } from './adapters/impl/socketio-adapter';
export {
  default as RabbitMqAdapter,
  RabbitMqAdapterOptions
} from './adapters/impl/rabbitmq-adapter';

// adapters/impl/middlewares
export { ISession, IToken } from './adapters/impl/middlewares/restify-session-middleware';

// controllers
export { default as AbstractController } from './controllers/abstract-controller';
export {
  Endpoints,
  EndpointOptions,
  endpoint,
  endpointController,
  rpc,
  rpcController
} from './controllers/endpoint-decorator';


// models
export { default as ModelFactory } from './models/model-factory';

// services
export { default as MessageBrokerService } from './services/message-broker-service';
export { default as PushService } from './services/push-service-refactor';
export { default as RPCService } from './services/rpc-service';
export {
  default as AbstractBrokerService,
  IConsumerInfo
} from './services/abstract-broker-service';

// utils
export { default as MessagePack } from './utils/msgpack';
export { default as ObjectWrapper } from './utils/object-wrapper';
export { default as ObjectFactory } from './utils/object-factory';
export { default as StaticDataLoader } from './utils/staticdata-loader';
export { default as StaticDataFactory } from './utils/staticdata-factory';

//
export { Request, Response } from './adapters/impl/restify-adapter';

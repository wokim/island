require('source-map-support').install();
exports.mongoose = require('mongoose');
var _debug = require('debug');
function debug(namespace) {
    return _debug('[' + namespace + ']');
}
exports.debug = debug;
function error(namespace) {
    var d = _debug('[' + namespace + ']');
    d.log = console.error.bind(console);
    return d;
}
exports.error = error;
var islet_1 = require('./islet');
exports.Islet = islet_1.default;
// adapters
var abstract_adapter_1 = require('./adapters/abstract-adapter');
exports.AbstractAdapter = abstract_adapter_1.default;
var listenable_adapter_1 = require('./adapters/listenable-adapter');
exports.ListenableAdapter = listenable_adapter_1.default;
// adapters/impl
var message_broker_adapter_1 = require('./adapters/impl/message-broker-adapter');
exports.MessageBrokerAdapter = message_broker_adapter_1.default;
var mongoose_adapter_1 = require('./adapters/impl/mongoose-adapter');
exports.MongooseAdapter = mongoose_adapter_1.default;
var push_adapter_refactor_1 = require('./adapters/impl/push-adapter-refactor');
exports.PushAdapter = push_adapter_refactor_1.default;
var redis_connection_adapter_1 = require('./adapters/impl/redis-connection-adapter');
exports.RedisConnectionAdapter = redis_connection_adapter_1.default;
var restify_adapter_1 = require('./adapters/impl/restify-adapter');
exports.RestifyAdapter = restify_adapter_1.default;
var rpc_adapter_1 = require('./adapters/impl/rpc-adapter');
exports.RPCAdapter = rpc_adapter_1.default;
var socketio_adapter_1 = require('./adapters/impl/socketio-adapter');
exports.SocketIOAdapter = socketio_adapter_1.default;
var rabbitmq_adapter_1 = require('./adapters/impl/rabbitmq-adapter');
exports.RabbitMqAdapter = rabbitmq_adapter_1.default;
// adapters/impl/middlewares
// controllers
var abstract_controller_1 = require('./controllers/abstract-controller');
exports.AbstractController = abstract_controller_1.default;
var endpoint_decorator_1 = require('./controllers/endpoint-decorator');
exports.endpoint = endpoint_decorator_1.endpoint;
exports.endpointController = endpoint_decorator_1.endpointController;
exports.rpc = endpoint_decorator_1.rpc;
exports.rpcController = endpoint_decorator_1.rpcController;
// models
var model_factory_1 = require('./models/model-factory');
exports.ModelFactory = model_factory_1.default;
// services
var message_broker_service_1 = require('./services/message-broker-service');
exports.MessageBrokerService = message_broker_service_1.default;
var push_service_refactor_1 = require('./services/push-service-refactor');
exports.PushService = push_service_refactor_1.default;
var rpc_service_1 = require('./services/rpc-service');
exports.RPCService = rpc_service_1.default;
var abstract_broker_service_1 = require('./services/abstract-broker-service');
exports.AbstractBrokerService = abstract_broker_service_1.default;
// utils
var msgpack_1 = require('./utils/msgpack');
exports.MessagePack = msgpack_1.default;
var object_wrapper_1 = require('./utils/object-wrapper');
exports.ObjectWrapper = object_wrapper_1.default;
var object_factory_1 = require('./utils/object-factory');
exports.ObjectFactory = object_factory_1.default;
var staticdata_loader_1 = require('./utils/staticdata-loader');
exports.StaticDataLoader = staticdata_loader_1.default;
var staticdata_factory_1 = require('./utils/staticdata-factory');
exports.StaticDataFactory = staticdata_factory_1.default;
//
//# sourceMappingURL=index.js.map
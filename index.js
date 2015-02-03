//require('typescript-require');

// Should be loaded *.ts files directly using kind of 'typescript-require' library.
var base = './dist/';

exports.Islet = require(base + 'islet.js');
exports.AbstractAdapter = require(base + 'adapters/abstract-adapter.js');
exports.ListenableAdapter = require(base + 'adapters/listenable-adapter.js');
exports.AMQPAdapter = require(base + 'adapters/impl/amqp-adapter.js');
exports.MongooseAdapter = require(base + 'adapters/impl/mongoose-adapter.js');
exports.RedisConnectionAdapter = require(base + 'adapters/impl/redis-connection-adapter.js');
exports.RestifyAdapter = require(base + 'adapters/impl/restify-adapter.js');
exports.SocketIOAdapter = require(base + 'adapters/impl/socketio-adapter.js');
exports.AbstractController = require(base + 'controllers/abstract-controller.js');
exports.ModelFactory = require(base + 'models/model-factory.js');
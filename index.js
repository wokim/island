//require('typescript-require');

// Should be loaded *.ts files directly using kind of 'typescript-require' library.
var base = './dist/';

var program = require('commander');
program
  .option('--host <host>', 'hostname', process.env.ISLAND_HOST || '127.0.0.1')
  .option('-p, --port <n>', 'port number', function(val) { return parseInt(val, 10); }, process.env.ISLAND_PORT || 8080)
  .option('--etcd-server <host:port>', 'etcd server', function(val) {
    var parts = val.split(':');
    return { host: parts[0], port: parseInt(parts[1], 10) }
  }, { host: process.env.ISLAND_ETCD_HOST || '192.168.59.103', port: process.env.ISLAND_ETCD_PORT || 4001 })
  .option('--service-name <name>', 'service name', 'gateway-island')
  .parse(process.argv);

exports.argv = program;

var debug = require('debug');
exports.debug = function (namespace) {
  return debug(namespace);
}
exports.error = function (namespace) {
  var d = debug(namespace);
  d.log = console.error.bind(console);
  return d;
}

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

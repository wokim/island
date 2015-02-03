/// <reference path="../../../typings/tsd.d.ts" />
import restify = require('restify');
import Promise = require('bluebird');
import ListenableAdapter = require('../listenable-adapter');
import jwt = require('./middlewares/restify-jwt-middleware');
import session = require('./middlewares/restify-session-middleware');
import RestifyAdapterOptions = require('../../options/restify-adapter-options');

/**
 * RestifyAdapter
 * @class
 * @extends ListenableAdapter
 */
class RestifyAdapter extends ListenableAdapter<restify.Server, RestifyAdapterOptions> {
  /**
   * Initialize the restify server.
   * @override
   * @returns {Promise<void>}
   */
  public initialize() {
    var options = this.options;
    var server = restify.createServer(options);

    // Set default middleware
    server.use(restify.bodyParser({
      // TODO: export below params to external configuation file
      maxBodySize: 0
    }));

    // TODO: RSA-SHA256 is the recommendation.
    // Parse only if the Authorization header is the bearer JWT token.
    server.use(jwt({ secret: options.secret }));
    server.use(session({ store: options.store }));

    if (options.middlewares) {
      server.use(options.middlewares);
    }

    this._adaptee = server;
    return Promise.resolve();
  }

  /**
   * Listen the restify server.
   * @override
   * @returns {Promise<void>}
   */
  public listen() {
    var deferred = Promise.defer<void>();
    this.adaptee.listen(this.options.port,(err) => {
      if (err) return deferred.reject(err);
      deferred.resolve();
    });
    return deferred.promise;
  }
}

export = RestifyAdapter;
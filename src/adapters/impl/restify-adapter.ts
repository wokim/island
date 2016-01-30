import * as restify from 'restify';
import * as Promise from 'bluebird';
import * as __ from 'debug';
import ListenableAdapter from '../listenable-adapter';
import queryParser from './middlewares/restify-query-parser';

/** @deprecated ***********************************/
import jwtParser, { IToken } from './middlewares/restify-jwt-middleware';
import sessionChecker, { ISession, ISessionStore } from './middlewares/restify-session-middleware';
export interface Request extends restify.Request {
  token?: IToken;
  session?: ISession;
}
export interface Response extends restify.Response {}
/**************************************************/

let debug = __('ISLAND:RESTIFY');

export interface RestifyAdapterOptions {
  serverOptions?: restify.ServerOptions;
  middlewares?: restify.RequestHandler[];
  store: ISessionStore; // @deprecated
  port: number;
  secret: string; // @deprecated
}

/**
 * RestifyAdapter
 * @class
 * @extends ListenableAdapter
 */
export default class RestifyAdapter extends ListenableAdapter<restify.Server, RestifyAdapterOptions> {
  /**
   * Initialize the restify server.
   * @override
   * @returns {Promise<void>}
   */
  public initialize() {
    var options = this.options;

    // v1 API 한정
    let serverOptions = options.serverOptions || {};
    serverOptions.formatters = {
      'application/json': (req, res, body, cb) => {
        // Copied from restify/lib/formatters/json.js
        if (body instanceof Error) {
          // snoop for RestError or HttpError, but don't rely on
          // instanceof
        res.statusCode = body.statusCode || 500;
          if (body.body) {
            body = body.body;
            body.stack = body.stack;
            body.extra = body.extra;
          } else {
            body = {
              name: body.name,
              message: body.message,
              stack: body.stack,
              extra: body.extra
            };
          }
        } else if (Buffer.isBuffer(body)) {
          body = body.toString('base64');
        }

        var data = JSON.stringify(body);
        res.setHeader('Content-Length', Buffer.byteLength(data));

        return cb(null, data);
      }
    }
    var server = restify.createServer(serverOptions);

    // Cleans up sloppy URLs on the request object, like /foo////bar/// to /foo/bar.
    // ex) /v2/a/b/ => /v2/a/b
    server.pre(restify.pre.sanitizePath());

    // TODO: 별도의 미들웨어로 분리하자
    // NOTE: /v2/xxx/yyy/:id => /v2/xxx/yyy/:id([a-f\d]{24}) 로 변환
    // :id 는 무조껀 objectid 로 간주함
    server.pre((req, res, next) => {
      if (req.url.indexOf(':id')) {
        req.url = req.url.replace(/:id/g, ':id([a-f\d]{24})');
      }
      next();
    });

    // Set default middleware
    server.use((req, res, next) => {
      debug('\n\n\t\t********** %s %s **********\n', req.method.toUpperCase(), req.url);
      next();
    });
    /*
    restify.CORS.ALLOW_HEADERS.push('Content-Type');
    restify.CORS.ALLOW_HEADERS.push('Authorization');
    restify.CORS.ALLOW_HEADERS.push('X-Requested-With');
    server.use(restify.CORS());
    */
    server.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Content-Length');
      next();
    });
    server.use(restify.dateParser());
    server.use(queryParser());
    server.use(restify.bodyParser({
      // TODO: export below params to external configuation file
      maxBodySize: 0
    }));

    // @deprecated
    server.use(jwtParser({ secret: options.secret }));
    server.use(sessionChecker({ store: options.store }));

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
    this.adaptee.listen(this.options.port, (err) => {
      if (err) return deferred.reject(err);
      deferred.resolve();
    });
    return deferred.promise;
  }
}

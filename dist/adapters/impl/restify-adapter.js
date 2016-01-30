var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var restify = require('restify');
var Promise = require('bluebird');
var __ = require('debug');
var listenable_adapter_1 = require('../listenable-adapter');
var restify_query_parser_1 = require('./middlewares/restify-query-parser');
/** @deprecated ***********************************/
var restify_jwt_middleware_1 = require('./middlewares/restify-jwt-middleware');
var restify_session_middleware_1 = require('./middlewares/restify-session-middleware');
/**************************************************/
var debug = __('ISLAND:RESTIFY');
/**
 * RestifyAdapter
 * @class
 * @extends ListenableAdapter
 */
var RestifyAdapter = (function (_super) {
    __extends(RestifyAdapter, _super);
    function RestifyAdapter() {
        _super.apply(this, arguments);
    }
    /**
     * Initialize the restify server.
     * @override
     * @returns {Promise<void>}
     */
    RestifyAdapter.prototype.initialize = function () {
        var options = this.options;
        // v1 API 한정
        var serverOptions = options.serverOptions || {};
        serverOptions.formatters = {
            'application/json': function (req, res, body, cb) {
                // Copied from restify/lib/formatters/json.js
                if (body instanceof Error) {
                    // snoop for RestError or HttpError, but don't rely on
                    // instanceof
                    res.statusCode = body.statusCode || 500;
                    if (body.body) {
                        body = body.body;
                        body.stack = body.stack;
                        body.extra = body.extra;
                    }
                    else {
                        body = {
                            name: body.name,
                            message: body.message,
                            stack: body.stack,
                            extra: body.extra
                        };
                    }
                }
                else if (Buffer.isBuffer(body)) {
                    body = body.toString('base64');
                }
                var data = JSON.stringify(body);
                res.setHeader('Content-Length', Buffer.byteLength(data));
                return cb(null, data);
            }
        };
        var server = restify.createServer(serverOptions);
        // Cleans up sloppy URLs on the request object, like /foo////bar/// to /foo/bar.
        // ex) /v2/a/b/ => /v2/a/b
        server.pre(restify.pre.sanitizePath());
        // TODO: 별도의 미들웨어로 분리하자
        // NOTE: /v2/xxx/yyy/:id => /v2/xxx/yyy/:id([a-f\d]{24}) 로 변환
        // :id 는 무조껀 objectid 로 간주함
        server.pre(function (req, res, next) {
            if (req.url.indexOf(':id')) {
                req.url = req.url.replace(/:id/g, ':id([a-f\d]{24})');
            }
            next();
        });
        // Set default middleware
        server.use(function (req, res, next) {
            debug('\n\n\t\t********** %s %s **********\n', req.method.toUpperCase(), req.url);
            next();
        });
        /*
        restify.CORS.ALLOW_HEADERS.push('Content-Type');
        restify.CORS.ALLOW_HEADERS.push('Authorization');
        restify.CORS.ALLOW_HEADERS.push('X-Requested-With');
        server.use(restify.CORS());
        */
        server.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Content-Length');
            next();
        });
        server.use(restify.dateParser());
        server.use(restify_query_parser_1.default());
        server.use(restify.bodyParser({
            // TODO: export below params to external configuation file
            maxBodySize: 0
        }));
        // @deprecated
        server.use(restify_jwt_middleware_1.default({ secret: options.secret }));
        server.use(restify_session_middleware_1.default({ store: options.store }));
        if (options.middlewares) {
            server.use(options.middlewares);
        }
        this._adaptee = server;
        return Promise.resolve();
    };
    /**
     * Listen the restify server.
     * @override
     * @returns {Promise<void>}
     */
    RestifyAdapter.prototype.listen = function () {
        var deferred = Promise.defer();
        this.adaptee.listen(this.options.port, function (err) {
            if (err)
                return deferred.reject(err);
            deferred.resolve();
        });
        return deferred.promise;
    };
    return RestifyAdapter;
})(listenable_adapter_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestifyAdapter;
//# sourceMappingURL=restify-adapter.js.map
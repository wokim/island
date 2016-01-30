var restify = require('restify');
var jwt = require('jsonwebtoken');
/**
 * Check the HTTP authorization header, then parse only if the header is a bearer JWT token.
 * @param {{secret: string}} options
 * @return {RequestHandler}
 */
function jwtParser(options) {
    return function (req, res, next) {
        /**
         * Authorization field of the request header examples
         *
         *  GET /auth/ HTTP/1.1
         *  Host: www.example.com
         *  Authorization: Basic aHR0cHdhdGNoOmY=
         */
        var header = req.headers['authorization'];
        if (!header)
            return next();
        var parts = header.split(' ');
        if (!parts || parts.length !== 2) {
            console.log('[RESTIFY] invalid auth header', parts);
            return next(new restify.InvalidHeaderError('Invalid Authorization header'));
        }
        var scheme = parts[0];
        var credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
            jwt.verify(credentials, options.secret, function (err, decode) {
                if (err)
                    return next();
                req['token'] = typeof decode === 'string' ? JSON.parse(decode) : decode;
                next();
            });
        }
        else {
            next();
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jwtParser;
//# sourceMappingURL=restify-jwt-middleware.js.map
/**
 * Session checker.
 * @deprecated
 * @param {{store: ISessionStore}} options
 * @return {RequestHandler}
 */
function sessionChecker(options) {
    return function (req, res, next) {
        var token = req['token'];
        if (!token)
            return next();
        options.store.getSession(token.sid).then(function (session) {
            req['session'] = session;
            next();
        }).catch(function (err) {
            // NOTE: 이 미들웨어는 삭제될 것 이다
            //console.log('[RESTIFY] session not found', err);
            //next(new restify.InvalidCredentialsError(err.message));
            next();
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sessionChecker;
//# sourceMappingURL=restify-session-middleware.js.map
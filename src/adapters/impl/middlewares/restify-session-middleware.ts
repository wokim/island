/// <reference path="../../../../typings/tsd.d.ts" />
import restify = require('restify');
import ISessionStore = require('../interfaces/session-store-interface');
import IToken = require('../interfaces/token-interface');

/**
 * Session checker.
 * @param {{store: ISessionStore}} options
 * @return {RequestHandler}
 */
function sessionChecker(options: { store: ISessionStore }): restify.RequestHandler {
  return function (req: restify.Request, res: restify.Response, next: restify.Next) {
    var token: IToken = req['token'];
    if (!token) return next();
    options.store.getSession(token.sid).then(session => {
      req['session'] = session;
      next();
    }).catch(next);
  };
}

export = sessionChecker;
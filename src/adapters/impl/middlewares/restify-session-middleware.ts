import restify = require('restify');
import { IToken } from './restify-jwt-middleware';
export { IToken }

export interface ISession {
  sid: string;
  aid: string;
  aname?: string;
  current?: {
    pid: string;
  };
  publisher: string;
  nx?: {
    accountid:string; // xxxxxxxx@(nx|daum|naver)
    nexonid:string; // for nexon shop API
    channelinguid:string; // for nexon session login
    cc:string;
  };
  tc?: {
    qqid: number;
    fatiguerate: number;
  };
}

export interface ISessionStore {
  getSession(sid: string): Promise<ISession>;
  setSession(sid: string, session: ISession): Promise<ISession>;
  deleteSession(sid: string): Promise<void>;
}

/**
 * Session checker.
 * @deprecated
 * @param {{store: ISessionStore}} options
 * @return {RequestHandler}
 */
export default function sessionChecker(options: { store: ISessionStore }): restify.RequestHandler {
  return function (req: restify.Request, res: restify.Response, next: restify.Next) {
    var token: IToken = req['token'];
    if (!token) return next();
    options.store.getSession(token.sid).then(session => {
      req['session'] = session;
      next();
    }).catch((err: Error) => {
      // NOTE: 이 미들웨어는 삭제될 것 이다
      //console.log('[RESTIFY] session not found', err);
      //next(new restify.InvalidCredentialsError(err.message));
      next();
    });
  };
}
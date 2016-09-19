import * as Promise from 'bluebird';
import * as events from 'events';

export class Response extends events.EventEmitter {
  private _body: any;
  private _statusCode: number;
  private _url: string;

  set statusCode(code: number) { this._statusCode = code; }
  get statusCode() { return this._statusCode; }
  get body() { return this._body; }
  get url() { return this._url; }

  end(body: any) {
    this._body = (typeof body === 'string') ? JSON.parse(body) : body;
    // NOTE: 'end' 가 이미 사용중인 것 같다. 사용되지 않을 것 같은 xxx로 사용
    this.emit('xxx', body);
  }

  redirect(url: string) {
    this._url = url;
  }

  setHeader(key: string, value: any) {
    // TODO
  }
}

export function middleware(...middlewares: ((req, res, next) => any)[]) {
  return function middlewareDecorator(target, key, descriptor) {
    let originalMethod = descriptor.value;
    descriptor.value = (...args) => {
      let {req, res} = {req: args[0], res: new Response()};
      let promises = middlewares.map(middleware => {
        return (req: any, res: Response) => {
          return new Promise<any>((resolve, reject) => {
            res.once('xxx', body => resolve());
            middleware(req, res, err => {
              if (err) return reject(err);
              res.removeAllListeners('xxx');
              resolve();
            });
          });
        };
      });
      return Promise.reduce(promises, (total, current) => current(req, res), promises[0])
        .then(() => args[args.length] = res)
        .then(() => originalMethod.apply(this, args))
        .catch(err => Promise.reject(err));
    };
  };
}
/// <reference path="../../typings/tsd.d.ts" />
import restify = require('restify');
import ISessionStore = require('../adapters/impl/interfaces/session-store-interface');

interface RestifyAdapterOptions {
  serverOptions?: restify.ServerOptions;
  middlewares?: restify.RequestHandler[];
  store: ISessionStore;
  port: number;
  secret: string;
}

export = RestifyAdapterOptions;
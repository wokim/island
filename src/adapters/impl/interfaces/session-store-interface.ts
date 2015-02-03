/// <reference path="../../../../typings/tsd.d.ts" />
import Promise = require('bluebird');

interface ISessionStore {
  getSession(sid: string): Promise<any>;
  setSession(sid: string, session: any): Promise<any>;
  deleteSession(sid: string): Promise<void>;
}

export = ISessionStore;
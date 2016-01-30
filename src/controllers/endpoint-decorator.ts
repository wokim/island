import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as _debug from 'debug';

import AbstractController from './abstract-controller';

let debug = _debug('ISLAND:CTRL:ENDPOINT');

export interface Endpoint {
  options?: EndpointOptions;
  handler?: (req) => Promise<any>;
}

export type Endpoints = { [name: string]: Endpoint };

export interface EndpointOptions {
  scope?: {
    resource: number;
    authority: number;
  };
  version?: string;
  ignoreAllMiddleware?: boolean;
  schema?: any;
  developmentOnly?: boolean;
}

export function endpoint(name: string, options?: EndpointOptions) {
  return function _endpointMethodDecorator(target, key, desc) {
    let mangledName = name.replace(' ', '@').replace(/\//g, '|');
    let constructor = target.constructor;
    constructor._endpointMethods = constructor._endpointMethods || {};
    constructor._endpointMethods[mangledName] = {
      options: options,
      handler: desc.value
    };
  };
}

export function endpointController(registerer?: {registerEndpoint: (name: string, value: any) => Promise<any>}) {
  return function _endpointControllerDecorator(target) {
    let _onInitialized = target.prototype.onInitialized;
    target.prototype.onInitialized = function () {
      return Promise.all(_.map(target._endpointMethods, (v: {options: EndpointOptions, handler}, name) => {
          if (v.options && v.options.developmentOnly && process.env.NODE_ENV !== 'development') {
            return Promise.resolve();
          }
          debug('ENDPOINT 등록:', name);
          return this.server.register(name, v.handler.bind(this)).then(() => {
            return registerer && registerer.registerEndpoint(name, v.options || {}) || Promise.resolve();
          });
        }))
        .then(() => _onInitialized.apply(this));
    };
    let _onDestroy = target.prototype.onDestroy;
    target.prototype.onDestroy = function () {
      return Promise.all(_.map(target._endpointMethods, (__, name) => {
        debug('stop serving', name);
        return this.server.unregister(name);
      }))
      .then(() => _onDestroy.apply(this));
    };
  };
}

export function rpc(target, key, desc) {
  let constructor = target.constructor;
  constructor._rpcMethods = constructor._rpcMethods || {};
  constructor._rpcMethods[key] = desc.value;
}

export function rpcController(target) {
  let _onInitialized = target.prototype.onInitialized;
  target.prototype.onInitialized = function () {
    return Promise.all(_.map(target._rpcMethods, (handler: Function, name) => {
        debug('RPC 등록:', name);
        return this.server.register(name, handler.bind(this));
      }))
      .then(() => _onInitialized.apply(this));
  };
  let _onDestroy = target.prototype.onDestroy;
  target.prototype.onDestroy = function () {
    return Promise.all(_.map(target._rpcMethods, (__,  name) => {
      debug('stop serving', name);
      return this.server.unregister(name);
    }))
    .then(() => _onDestroy.apply(this));
  };
}

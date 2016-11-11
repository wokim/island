import * as _ from 'lodash';
import { logger } from '../utils/logger';

export interface RpcOptions {
  version?: string;
  schema?: RpcSchemaOptions;
  developmentOnly?: boolean;
}

export interface RpcSchemaOptions {
  query?: {
    sanitization: any;
    validation: any;
  }
  result?: {
    sanitization: any;
    validation: any;
  }
}

interface Rpc {
  name: string;
  options: RpcOptions;
  handler: (req) => Promise<any>;
}

function pushSafe(object, arrayName, element) {
  const array = object[arrayName] = object[arrayName] || [];
  array.push(element);
}

export function rpc(rpcOptions?: RpcOptions) {
  return (target, name, desc: PropertyDescriptor) => {
    const handler = desc.value;
    const options = _.merge({}, handler.options || {}, rpcOptions) as RpcOptions;
    const endpoint = { name, options, handler };
    pushSafe(handler, 'endpoints', endpoint);

    const constructor = target.constructor;
    pushSafe(constructor, '_endpointMethods', endpoint);
  };
}

export function rpcController(registerer?: {registerRpc: (name: string, value: any) => Promise<any>}) {
  return function(target) {
    const _onInitialized = target.prototype.onInitialized;
    target.prototype.onInitialized = function () {
      return Promise.all(_.map(target._endpointMethods, (v: Rpc) => {
        const developmentOnly = _.get(v, 'options.developmentOnly');
        if (developmentOnly && process.env.NODE_ENV !== 'development') return Promise.resolve();

        return this.server.register(v.name, v.handler.bind(this), 'rpc', v.options).then(() => {
          return registerer && registerer.registerRpc(v.name, v.options || {}) || Promise.resolve();
        });
      }))
      .then(() => _onInitialized.apply(this));
    };
    const _onDestroy = target.prototype.onDestroy;
    target.prototype.onDestroy = function () {
      return Promise.all(_.map(target._endpointMethods, (__, name) => {
          logger.info('stop serving', name);
          // TODO: IslandKeeper.unregisterRpc
          // 마지막 한 아아일랜드가 내려갈 때 IslandKeeper에서도 사라져야 될텐데? @kson //2016-08-09
          return this.server.unregister(name);
        }))
        .then(() => _onDestroy.apply(this));
    };
  };
}

import * as _ from 'lodash';
import { Di } from './di';
import { IAbstractAdapter } from '../adapters/abstract-adapter';
import { ScopeExit } from './scope-exit';
import { ResourcePush } from './resource-push';

export function bindImpliedServices(adapters: {[name: string]: IAbstractAdapter}) {
  _.forEach(adapters, (adapter: IAbstractAdapter, name: string) => {
    Di.container
      .bindConstant(name, adapter.adaptee)
      .bindConstant(adapter.adaptee.constructor, adapter.adaptee);
  });
  
  Di.container
    .bindScopeResource(ScopeExit, service => service.disposer())
    .bindScopeResource(ResourcePush, service => service.disposer());
}
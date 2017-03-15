import { Di } from 'island-di';
import * as _ from 'lodash';

import { IAbstractAdapter } from '../adapters/abstract-adapter';
import { ResourcePush } from './resource-push';
import { ScopeExit } from './scope-exit';

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

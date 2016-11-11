import 'reflect-metadata';
import * as Bluebird from 'bluebird';
import { logger } from '../utils/logger';
import * as _ from 'lodash';
import * as inversify from 'inversify';
import ObjectWraper from './object-wrapper';
import ObjectFactory from './object-factory';
import { FatalError, ISLAND } from '../utils/error';

export namespace Di {

  const MetadataKeys = {
    InversifyParamTypes: 'invesify:paramtypes',
    DesignParamTypes: 'design:paramtypes',
    IslandInjectionTag: 'island:injectiontag'
  };

  export interface DisposerFactory<T> {
    (resource: T): Bluebird.Disposer<T>;
  }

  export interface ScopeResource {
    constructor: new (...args) => any;
    disposerFactory: DisposerFactory<any>;
  }

  export class Container {
    private kernel: inversify.interfaces.Kernel;
    private scopeResources: ScopeResource[] = [];

    constructor() {
      this.kernel = new inversify.Kernel();
    }

    bindTransientClass(aClass: new (...args) => any): Container {
      this.decorateInjectable(aClass);
      this.kernel.bind(aClass).to(aClass);
      return this;
    }

    bindScopeResource<T>(aClass: new (...args) => T, disposerFactory: DisposerFactory<T>): Container {
      this.decorateInjectable(aClass);
      this.scopeResources.push({constructor: aClass, disposerFactory});
      return this;
    }

    private decorateInjectable(aClass: new (...args) => any): void {
      inversify.decorate((target: any) => {
        // little hack: using unexported metadata
        // @see https://github.com/inversify/InversifyJS/blob/master/src/annotation/injectable.ts
        if (Reflect.hasOwnMetadata(MetadataKeys.InversifyParamTypes, target) === true) {
          return;
        }
        return inversify.injectable()(target);
      }, aClass);
    }

    bindConstant(identifier: InjectionIdentifier<any>, value: any): Container {
      this.kernel.bind(identifier).toConstantValue(value);
      return this;
    }

    bindObjectWrapper(aClass: typeof ObjectWraper): Container {
      this.kernel.bind(aClass as any).toDynamicValue(() => ObjectFactory.get(aClass));
      return this;
    }

    scope(): Scope {
      return new Scope(this.kernel, this.scopeResources);
    }
  }

  export type InjectionIdentifier<T> = string | (new (...args: any[]) => T);

  export class Scope {
    private kernel: inversify.interfaces.Kernel;
    private objToBindScopeContext: {[name: string]: any};
    private injections: InjectionIdentifier<any>[] = [];
    private disposers: {[name: string]: Bluebird.Disposer<any>} = {};

    constructor(kernel,
                private scopeResources: ScopeResource[]) {
      this.kernel = kernel;
    }

    context(contextToBind: {[name: string]: any}): Scope {
      this.objToBindScopeContext = contextToBind;
      return this;
    }

    inject(...args: InjectionIdentifier<any>[]): Scope {
      this.injections = args;
      return this;
    }

    run<R>(task: (...args: any[]) => Promise<R> | R): Promise<R> {
      this.kernel.snapshot();
      this.bindScopeContext();
      this.bindResources();
      let injectedObjects = this.injectScopeParameters();
      this.kernel.restore();

      let disposerArray = _.map(this.disposers, disposer => disposer);
      return Promise.resolve(Bluebird.using(disposerArray, () => {
        return Promise.resolve<R>(task.apply(null, injectedObjects));
      }));
    }

    private bindScopeContext(): void {
      this.kernel
        .bind(ScopeContext)
        .to(ScopeContext)
        .inSingletonScope();

      if (this.objToBindScopeContext) {
        let scopeContext = this.kernel.get(ScopeContext);
        _.forEach(this.objToBindScopeContext, (value, name: string) => {
          scopeContext.setOnce(name, value);
        });
      }
    }

    private bindResources(): void {
      this.scopeResources.forEach(resource => {
        const name = this.kernel.getServiceIdentifierAsString(resource.constructor);
        const instanceBindName = name + '@instance';

        this.kernel
          .bind(instanceBindName)
          .to(resource.constructor)
          .inSingletonScope();

        this.kernel
          .bind(resource.constructor)
          .toDynamicValue(() => {
            let instance = this.kernel.get(instanceBindName);
            if (!this.disposers[name]) {
              this.disposers[name] = resource.disposerFactory(instance);
            }
            return instance;
          });
      });
    }

    private injectScopeParameters(): any[] {
      return this.injections.map(identifier => this.kernel.get(identifier));
    }
  }

  @inversify.injectable()
  export class ScopeContext {
    private context: {[name: string]: any} = {};

    setOnce(name: string, value: any): ScopeContext {
      if (this.context.hasOwnProperty(name)) {
        throw new FatalError(ISLAND.FATAL.F0016_SCOPE_CONTEXT_ERROR, `${name} is supposed to be set only once`);
      }
      this.context[name] = value;
      return this;
    }

    get<T>(name: string): T {
      if (!this.context.hasOwnProperty(name)) {
        throw new FatalError(ISLAND.FATAL.F0017_SCOPE_CONTEXT_ERROR, `${name} was not set`);
      }
      return this.context[name] as T;
    }
  }

  export function inject(target: any, key?: string, index?: number): any {
    if (typeof index === 'number') {
      return inject(getParamType(target, key, index), key)(target, key, index);
    }
    return injectDecoratorFactory(target);
  }

  function getParamType(target: any, key?: string, index?: number): any {
    // key! - hasOwnMetadata should take <string | symbol | undefined> as the key
    //        but the spec has built before TypeScript 2.0
    if (!Reflect.hasOwnMetadata(MetadataKeys.DesignParamTypes, target, key!)) {
      throw new FatalError(ISLAND.FATAL.F0018_ERROR_COLLECTING_META_DATA, 'error on collecting metadata. check compiler option emitDecoratorMetadata is true');
    }
    // key! and index! - We can assume the properties is not `undefined` at this point
    //                   after the condition check as above
    const paramTypes = Reflect.getMetadata(MetadataKeys.DesignParamTypes, target, key!);
    return paramTypes[index!];
  }

  function injectDecoratorFactory(id: InjectionIdentifier<any>) {
    return (target: any, key: string, index: number) => {
      if (key === undefined) {
        return inversify.inject(id)(target, key, index);
      }
      let injectionTags = Reflect.getOwnMetadata(MetadataKeys.IslandInjectionTag, target, key) || [];
      injectionTags.push({index, id});
      Reflect.defineMetadata(MetadataKeys.IslandInjectionTag, injectionTags, target, key);
    };
  }

  export function scope(target: any, name: string, descriptor: PropertyDescriptor): any {
    let method = descriptor.value;
    descriptor.value = function (...args: any[]) {
      let injectionTags = Reflect.getOwnMetadata(MetadataKeys.IslandInjectionTag, target, name) || [];
      return container.scope()
        .inject(...injectionTags.map(tag => tag.id))
        .run((...injectedObjects: any[]) => {
          injectionTags.forEach((tag, i) => {
            if (args[tag.index] !== undefined) {
              logger.debug(`override parameter[${tag.index}] by ${tag.id}`);
            }
            args[tag.index] = injectedObjects[i];
          });
          return method.apply(this, args);
        });
    };
  }

  export var container = new Di.Container();
}


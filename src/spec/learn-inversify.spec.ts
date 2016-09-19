import 'reflect-metadata';
import 'source-map-support/register';
import { logger } from '../utils/logger';

import * as inversify from 'inversify';

let inject = function (target: any, key: string, index: number) {
  if (!Reflect.hasOwnMetadata('design:paramtypes', target)) {
    logger.error('metadata required');
    return;
  }
  let paramTypes = Reflect.getMetadata('design:paramtypes', target);
  return inversify.inject(paramTypes[index])(target, key, index);
};

let injectable = function (target: any) {
  if (Reflect.hasOwnMetadata('inversify:paramtypes', target) === true) {
    return;
  }
  return inversify.injectable()(target);
};

class KernelWrapper {
  private kernel = new inversify.Kernel();

  bindClass(aClass: any) {
    inversify.decorate(injectable, aClass);
    this.kernel.bind(aClass).to(aClass).when(request => !request.target.isNamed());
  }

  bindClassNamed(id, aClass, name) {
    inversify.decorate(injectable, aClass);
    this.kernel.bind(id).to(aClass).whenTargetNamed(name);
  }

  bindValue(name: string, value) {
    this.kernel.bind(name).toConstantValue(value);
  }

  get<T>(identifier: (string | inversify.interfaces.Newable<T>)): T {
    return this.kernel.get(identifier);
  }
}

class Foo {
  say() { return 'foo'; }
}

class Fooo {
  say() { return 'fooo'; }
}

class Baz {
  say() { return 'value'; }
}

interface IFoo {
  name: string;
}

class Bar {
  constructor (@inject private foo: Foo) {
  }

  letFooSay() { return this.foo.say(); }
}

describe('inversify', () => {
  let kernelWrapper = new KernelWrapper();
  beforeAll(() => {
    kernelWrapper.bindClass(Foo);
    kernelWrapper.bindClassNamed(Foo, Foo, 'foo');
    kernelWrapper.bindClassNamed(Foo, Fooo, 'fooo');
    kernelWrapper.bindClass(Bar);
    kernelWrapper.bindValue('Baz', new Baz());
  });

  it(`should inject Foo into Bar`, () => {
    let bar = kernelWrapper.get(Bar);
    expect(bar.letFooSay()).toBe('foo');
  });

  it(`should inject Value`, () => {
    expect(kernelWrapper.get<Baz>('Baz')).toEqual(jasmine.any(Baz));
  });
});


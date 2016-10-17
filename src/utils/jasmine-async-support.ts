/**
 * when using typescript async/await, awaiter wraps your function body and catches every exceptions.
 * so this adapter returns a function which invokes 'done' / 'done.fail' after the promise settled.
 *
 * example)
 *
 * import spec = island.spec;
 *
 * it('is a spec using async function', spec(async () => {
 *   await rejectSomething();
 * }));
 */

export function jasmineAsyncAdapter(assertion: () => Promise<void>) {
  return function (done) {
    assertion.call(this).then(done, done.fail);
  };
}

export function createSpyObjWithAllMethods<T>(Class: new (...args) => T): T {
  const methods = Object.getOwnPropertyNames(Class.prototype)
    .filter(name => name !== 'constructor');
  
  if (!methods || methods.length === 0) {
    return {} as T;
  }

  return jasmine.createSpyObj(Class.name, methods);
}

import * as Promise from 'bluebird';

export default class StaticDataLoader<T> {
  protected object: T;

  public get Object() {
    if (!this.object) throw new Error('Exception :: This object is not initialized');
    return this.object;
  }

  public initialize(): Promise<any> {
    throw new Error('Exception :: This object is not implemented.');
  }

}
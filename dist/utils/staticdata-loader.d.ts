import * as Promise from 'bluebird';
export default class StaticDataLoader<T> {
    protected object: T;
    Object: T;
    initialize(): Promise<any>;
}

import Promise = require('bluebird');
import AbstractBrokerService, { IConsumerInfo } from './abstract-broker-service';
export default class RPCService extends AbstractBrokerService {
    private consumerInfosMap;
    initialize(): Promise<void>;
    purge(): Promise<{}>;
    private replaceUndefined(obj);
    register(name: string, handler: (msg: any) => Promise<any>): Promise<IConsumerInfo>;
    unregister(name: string): Promise<void>;
    invoke<T, U>(name: string, msg: T): Promise<U>;
    invoke(name: string, msg: any): any;
}

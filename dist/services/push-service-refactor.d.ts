import * as amqp from 'amqplib';
import * as Promise from 'bluebird';
import { IConsumerInfo } from './abstract-broker-service';
export default class PushService {
    private connection;
    private static PUSH_FANOUT_EXCHANGE;
    private static UNICAST_EXCHANGE_OPTIONS;
    private static DEFAULT_EXCHANGE_OPTIONS;
    private static SESSION_Q_OPTIONS;
    private msgpack;
    constructor(connection: amqp.Connection);
    private getChannelDisposer();
    initialize(): Promise<{}>;
    purge(): Promise<{}>;
    bindAccount(sid: string, aid: string): Promise<{}>;
    unbindAccount(sid: string, aid: string): Promise<{}>;
    bindPlayer(sid: string, pid: string): Promise<{}>;
    unbindPlayer(sid: string, pid: string): Promise<{}>;
    bindExchange(destination: string, source: string, pattern?: string, sourceType?: string, sourceOpts?: any): Promise<{}>;
    unbindExchange(destination: string, source: string, pattern?: string): Promise<{}>;
    unicast(exchange: string, msg: any, options?: any): Promise<{}>;
    multicast(exchange: string, msg: any, routingKey?: string, options?: any): Promise<{}>;
    broadcast(msg: any, options?: any): Promise<{}>;
    consume(sid: string, handler: (msg: any, decodedContent: any) => void, options?: any): Promise<IConsumerInfo>;
    cancel(consumerInfo: IConsumerInfo): Promise<void>;
}

import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');
import MessagePack from '../utils/msgpack';
export interface IConsumerInfo {
    channel: amqp.Channel;
    tag: string;
}
export default class AbstractBrokerService {
    protected connection: amqp.Connection;
    protected options: {
        rpcTimeout?: number;
    };
    protected msgpack: MessagePack;
    protected initialized: boolean;
    constructor(connection: amqp.Connection, options?: {
        rpcTimeout?: number;
    });
    initialize(): Promise<any>;
    private getChannel();
    private call(handler, ignoreClosingChannel?);
    protected declareExchange(name: string, type: string, options: amqp.ExchangeOptions): Promise<any>;
    protected deleteExchage(name: string, options?: amqp.DeleteOptions): Promise<any>;
    protected declareQueue(name: string, options: amqp.AssertOptions): Promise<any>;
    protected deleteQueue(name: string, options?: amqp.DeleteOptions): Promise<any>;
    protected bindQueue(queue: string, source: string, pattern?: string, args?: any): Promise<any>;
    protected unbindQueue(queue: string, source: string, pattern?: string, args?: any): Promise<any>;
    protected sendToQueue(queue: string, content: any, options?: any): Promise<any>;
    protected ack(message: any, allUpTo?: any): Promise<any>;
    protected _consume(key: string, handler: (msg) => void, options?: any): Promise<IConsumerInfo>;
    protected _cancel(consumerInfo: IConsumerInfo): Promise<any>;
    protected _publish(exchange: any, routingKey: any, content: any, options?: any): Promise<any>;
}

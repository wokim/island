import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');
import ListenableAdapter from '../listenable-adapter';
export interface RabbitMqAdapterOptions {
    url: string;
    serviceName?: string;
    socketOptions?: amqp.SocketOptions;
    rpcTimeout?: number;
}
export default class RabbitMqAdapter<T> extends ListenableAdapter<T, RabbitMqAdapterOptions> {
    protected connection: amqp.Connection;
    /**
     * @returns {Promise<void>}
     * @override
     */
    initialize(): Promise<void>;
    listen(): Promise<void>;
}

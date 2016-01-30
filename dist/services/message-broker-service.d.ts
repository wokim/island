import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');
import AbstractBrokerService from './abstract-broker-service';
export default class MessageBrokerService extends AbstractBrokerService {
    private static EXCHANGE_NAME;
    private serviceName;
    private consumerInfo;
    private handlers;
    constructor(connection: amqp.Connection, serviceName: string);
    initialize(): Promise<void>;
    purge(): Promise<void>;
    private onMessage(msg, routingKey);
    private matcher(pattern);
    subscribe(pattern: string, handler?: (msg: any) => void): Promise<any>;
    unsubscribe(pattern: string): Promise<any>;
    publish(key: string, msg: any): Promise<any>;
    private consume(handler, options?);
    private cancel(consumer);
}

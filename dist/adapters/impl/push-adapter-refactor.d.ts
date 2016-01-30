import amqp = require('amqplib');
import Promise = require('bluebird');
import ListenableAdapter from '../listenable-adapter';
import PushService from '../../services/push-service-refactor';
import { RabbitMqAdapterOptions } from './rabbitmq-adapter';
export default class PushAdapter extends ListenableAdapter<PushService, RabbitMqAdapterOptions> {
    protected connection: amqp.Connection;
    initialize(): Promise<any>;
    listen(): Promise<void>;
}

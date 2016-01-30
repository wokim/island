import RabbitMqAdapter from './rabbitmq-adapter';
import MessageBrokerService from '../../services/message-broker-service';
export default class MessageBrokerAdapter extends RabbitMqAdapter<MessageBrokerService> {
    /**
     * @returns {Promise<void>}
     * @override
     */
    initialize(): Promise<void>;
}

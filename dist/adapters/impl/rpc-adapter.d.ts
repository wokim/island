import RabbitMqAdapter from './rabbitmq-adapter';
import RPCService from '../../services/rpc-service';
export default class RPCAdapter extends RabbitMqAdapter<RPCService> {
    /**
     * @returns {Promise<void>}
     * @override
     */
    initialize(): Promise<void>;
}

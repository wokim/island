import RabbitMqAdapter from './rabbitmq-adapter';
import RPCService from '../../services/rpc-service';

export default class RPCAdapter extends RabbitMqAdapter<RPCService> {
  /**
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    return super.initialize().then(() => {
      this._adaptee = new RPCService(this.connection, this.options);
      return this._adaptee.initialize();
    });
  }
}

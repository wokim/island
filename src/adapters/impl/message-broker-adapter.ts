import RabbitMqAdapter from './rabbitmq-adapter';
import MessageBrokerService from '../../services/message-broker-service';
import { FatalError, ISLAND } from '../../utils/error';

export default class MessageBrokerAdapter extends RabbitMqAdapter<MessageBrokerService> {
  /**
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    return super.initialize().then(() => {
      if (!this.options) throw new FatalError(ISLAND.FATAL.F0025_MISSING_ADAPTER_OPTIONS);
      this._adaptee = new MessageBrokerService(this.connection, this.options.serviceName || 'unknownService');
      return this._adaptee.initialize();
    });
  }

  public listen(): Promise<void> {
    return this._adaptee.startConsume();
  }

  public destroy() {
    return super.destroy()
      .then(() => this._adaptee.purge());
  }
}

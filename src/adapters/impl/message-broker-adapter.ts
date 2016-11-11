import RabbitMqAdapter from './rabbitmq-adapter';
import MessageBrokerService from '../../services/message-broker-service';

export default class MessageBrokerAdapter extends RabbitMqAdapter<MessageBrokerService> {
  /**
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    return super.initialize().then(() => {
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

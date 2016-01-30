import RabbitMqAdapter from './rabbitmq-adapter';
import PushService from '../../services/push-service';

export default class PushAdapter extends RabbitMqAdapter<PushService> {
  /**
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    return super.initialize().then(() => {
      this._adaptee = new PushService(this.connection);
      return this._adaptee.initialize();
    });
  }
}

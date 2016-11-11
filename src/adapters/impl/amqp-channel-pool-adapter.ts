import AbstractAdapter from '../abstract-adapter';
import { AmqpChannelPoolService, AmqpOptions } from '../../services/amqp-channel-pool-service';

export class AmqpChannelPoolAdapter extends AbstractAdapter<AmqpChannelPoolService, AmqpOptions> {
  initialize(): Promise<void> {
    this._adaptee = new AmqpChannelPoolService();
    return this._adaptee.initialize(this.options);
  }

  destroy(): void {
    // TODO: should wait until other services stops using AmqpChannelPoolService
    //this.adaptee.purge();
  }
}

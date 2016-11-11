import AbstractAdapter from '../abstract-adapter';
import * as Bluebird from 'bluebird';
import { AmqpChannelPoolService, AmqpOptions } from '../../services/amqp-channel-pool-service';

export class AmqpChannelPoolAdapter extends AbstractAdapter<AmqpChannelPoolService, AmqpOptions> {
  initialize(): Promise<void> {
    this._adaptee = new AmqpChannelPoolService();
    return this._adaptee.initialize(this.options);
  }

  destroy(): void {
    //todo: should wait until other services stops using AmqpChannelPoolService
    //this.adaptee.purge();
  }
}

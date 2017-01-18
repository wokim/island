import { EventService } from '../../services/event-service';
import { FatalError, ISLAND } from '../../utils/error';
import ListenableAdapter from '../listenable-adapter';
import { AmqpChannelPoolAdapter } from './amqp-channel-pool-adapter';

export interface EventAdapterOptions {
  amqpChannelPoolAdapter: AmqpChannelPoolAdapter;
  serviceName: string;
}

export class EventAdapter extends ListenableAdapter<EventService, EventAdapterOptions> {
  async initialize(): Promise<void> {
    if (!this.options) throw new FatalError(ISLAND.FATAL.F0025_MISSING_ADAPTER_OPTIONS);
    this._adaptee = new EventService(this.options.serviceName || 'unknownService');
    const amqpChannelPoolService = this.options.amqpChannelPoolAdapter.adaptee;
    if (!amqpChannelPoolService) {
      throw new FatalError(ISLAND.FATAL.F0008_AMQP_CHANNEL_POOL_REQUIRED, 'AmqpChannelPoolService required');
    }
    await amqpChannelPoolService.waitForInit();
    return this._adaptee.initialize(amqpChannelPoolService);
  }

  listen(): Promise<void> {
    return this.adaptee.startConsume();
  }

  async destroy(): Promise<any> {
    await super.destroy();
    return this.adaptee.purge();
  }
}

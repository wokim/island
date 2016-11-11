import * as Bluebird from 'bluebird';
import ListenableAdapter from '../listenable-adapter';
import { EventService } from '../../services/event-service';
import { AmqpChannelPoolAdapter } from './amqp-channel-pool-adapter';
import { LogicError, FatalError, ISLAND } from '../../utils/error';

export interface EventAdapterOptions {
  amqpChannelPoolAdapter: AmqpChannelPoolAdapter;
  serviceName: string;
}

export class EventAdapter extends ListenableAdapter<EventService, EventAdapterOptions> {
  async initialize(): Promise<void> {
    this._adaptee = new EventService(this.options.serviceName || 'unknownService');
    let amqpChannelPoolService = this.options.amqpChannelPoolAdapter.adaptee;
    if (!amqpChannelPoolService) throw new FatalError(ISLAND.FATAL.F0008_AMQP_CHANNEL_POOL_REQUIRED, 'AmqpChannelPoolService required');
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

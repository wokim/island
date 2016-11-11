'use strict';

//import * as amqp from 'amqplib';
import * as Bluebird from 'bluebird';
import ListenableAdapter from '../listenable-adapter';
import PushService from '../../services/push-service';
import {RabbitMqAdapterOptions} from './rabbitmq-adapter';
import { AmqpChannelPoolAdapter } from './amqp-channel-pool-adapter';
import { LogicError, FatalError, ISLAND } from '../../utils/error';

export interface PushAdapterOptions {
  amqpChannelPoolAdapter: AmqpChannelPoolAdapter;
}

export default class PushAdapter extends ListenableAdapter<PushService, PushAdapterOptions> {
  async initialize(): Promise<void> {
    this._adaptee = new PushService();
    let amqpChannelPoolService = this.options.amqpChannelPoolAdapter.adaptee;
    if (!amqpChannelPoolService) throw new FatalError(ISLAND.FATAL.F0009_AMQP_CHANNEL_POOL_REQUIRED, 'AmqpChannelPoolService required');
    await amqpChannelPoolService.waitForInit();
    return this._adaptee.initialize(amqpChannelPoolService);
  }

  listen(): Promise<void> {
    return Promise.resolve();
  }

  async destroy(): Promise<any> {
    await super.destroy();
    return this.adaptee.purge();
  }
}

import * as _ from 'lodash';
import * as amqp from 'amqplib';
import * as Bluebird from 'bluebird';
import { logger } from '../utils/logger';
import * as util from 'util';

export interface AmqpOptions {
  url: string;
  socketOptions?: {noDelay?: boolean, heartbeat?: number};
  poolSize?: number;
}

export interface ChannelInfo {
  channel: amqp.Channel;
  date: number;
}

export class AmqpChannelPoolService {
  static DEFAULT_POOL_SIZE: number = 100;
  static EXPERATION_TIME: number = 1000 * 300;  // 5 minutes

  private connection: amqp.Connection;
  private options: AmqpOptions;
  private openChannels: amqp.Channel[] = [];
  private idleChannels: ChannelInfo[] = [];
  private initResolver: Bluebird.Resolver<void>;
  private date: Date;

  constructor() {
    this.initResolver = Bluebird.defer<void>();
    this.date = new Date();
  }

  initialize(options: AmqpOptions): Promise<void> {
    options.poolSize = options.poolSize || AmqpChannelPoolService.DEFAULT_POOL_SIZE;
    this.options = options;
    logger.info(`connecting to broker ${util.inspect(options, {colors: true})}`);
    Promise.resolve(amqp.connect(options.url, options.socketOptions))
      .then(connection => {
        logger.info(`connected to ${options.url}`);
        this.connection = connection;
        this.initResolver.resolve();
      })
      .catch(e => this.initResolver.reject(e));

    return Promise.resolve(this.initResolver.promise);
  }

  waitForInit(): Promise<void> {
    return Promise.resolve(this.initResolver.promise);
  }

  purge(): Promise<void> {
    return Promise.resolve(this.connection.close());
  }

  acquireChannel(): Promise<amqp.Channel> {
    return Promise.resolve(Bluebird.try(() => {
      if (this.idleChannels.length) {
        return this.idleChannels.pop().channel;
      }
      return this.createChannel();
    }));
  }

  releaseChannel(channel: amqp.Channel): Promise<void> {
    return Promise.resolve(Bluebird.try(() => {
      if (!_.includes(this.openChannels, channel)) {
        return;
      }
      if (this.idleChannels.length < this.options.poolSize) {
        this.idleChannels.push({channel:channel, date: this.date.getTime()});
        while(this.idleChannels.length > 0 &&
        this.idleChannels[0].date + AmqpChannelPoolService.EXPERATION_TIME < this.date.getTime()) {
          this.idleChannels.shift().channel.close();
        }
        return;
      }
      return channel.close();
    }));
  }

  usingChannel<T>(task: (channel: amqp.Channel) => PromiseLike<T>): Promise<T> {
    return Promise.resolve(Bluebird.using(this.getChannelDisposer(), task));
  }

  getChannelDisposer(): Bluebird.Disposer<amqp.Channel> {
    return Bluebird.resolve(this.acquireChannel())
      .disposer(channel => {
        this.releaseChannel(channel);
      });
  }

  private createChannel(): Promise<amqp.Channel> {
    return Promise.resolve(this.connection.createChannel())
      .then(channel => {
        this.setChannelEventHandler(channel);
        this.openChannels.push(channel);
        return channel;
      });
  }

  private setChannelEventHandler(channel: amqp.Channel) {
    channel
      .on('error', err => {
        logger.notice('amqp channel error:', err);
        err.stack && logger.debug(err.stack);
      })
      .on('close', () => {
        _.remove(this.idleChannels, (cur: ChannelInfo) => {
          return cur.channel == channel;
        });
        _.pull(this.openChannels, channel);
      });
  }
}


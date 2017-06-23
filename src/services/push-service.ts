import { ISLAND, LogicError } from '../utils/error';
import { logger } from '../utils/logger';
import MessagePack from '../utils/msgpack';
import { AmqpChannelPoolService } from './amqp-channel-pool-service';

const noMsgpack: Boolean = process.env.ISLAND_PUSH_NO_MSGPACK === 'true';
export default class PushService {
  // Exchange to broadcast to the entire users.
  public static broadcastExchange = {
    name: 'PUSH_FANOUT_EXCHANGE',
    options: {
      durable: true
    },
    type: 'fanout'
  };

  // Exchange to push to a specific user.
  public static playerPushExchange = {
    name: 'push.player',
    options: {
      durable: true
    },
    type: 'direct'
  };

  public static encode(obj): Buffer {
    try {
      const buf = new Buffer(JSON.stringify(obj));
      return buf;
    } catch (e) {
      logger.debug('[JSON ENCODE ERROR]', e);
      const error: any = new LogicError(ISLAND.LOGIC.L0007_JSON_ENCODE_ERROR, e.message);
      logger.debug(error.stack);
      throw e;
    }
  }
  public static decode(buf) {
    return JSON.parse(buf.toString());
  }

  private static DEFAULT_EXCHANGE_OPTIONS: any = {
    autoDelete: true,
    durable: true
  };

  private static autoDeleteTriggerQueue = {
    name: 'auto-delete.trigger',
    options: {
      messageTtl: 0
    }
  };

  private msgpack: MessagePack;
  private channelPool: AmqpChannelPoolService;

  constructor() {
    this.msgpack = MessagePack.getInst();
  }

  public async initialize(channelPool: AmqpChannelPoolService): Promise<any> {
    this.channelPool = channelPool;

    await this.channelPool.usingChannel(async channel => {
      const globalFanoutX = PushService.broadcastExchange;
      const playerPushX = PushService.playerPushExchange;
      await channel.assertExchange(globalFanoutX.name, globalFanoutX.type, globalFanoutX.options);
      await channel.assertExchange(playerPushX.name, playerPushX.type, playerPushX.options);
      await channel.assertQueue(PushService.autoDeleteTriggerQueue.name, PushService.autoDeleteTriggerQueue.options);
    });
  }

  async purge(): Promise<any> {
    return this.channelPool.usingChannel(channel => {
      return channel.deleteExchange(PushService.broadcastExchange.name, { ifUnused: true });
    });
  }

  async deleteExchange(exchange: string, options?: any): Promise<any> {
    return this.channelPool.usingChannel(channel => {
      logger.debug(`[INFO] delete exchange's name ${exchange}`);
      return channel.deleteExchange(exchange, options);
    });
  }

  /**
   * bind specific exchange wrapper
   * @param destination
   * @param source
   * @param pattern
   * @param sourceType
   * @param sourceOpts
   * @returns {Promise<any>}
   */
  async bindExchange(destination: string,
                     source: string,
                     pattern: string = '',
                     sourceType: string = 'fanout',
                     sourceOpts: any = PushService.DEFAULT_EXCHANGE_OPTIONS
  ): Promise<any> {
    logger.debug(`bind exchange. ${source} ==${pattern}==> ${destination}`);
    let sourceDeclared = false;
    try {
      await this.channelPool.usingChannel(async channel => {
        await channel.assertExchange(source, sourceType, sourceOpts);
        sourceDeclared = true;
        await channel.bindExchange(destination, source, pattern);
      });
    } catch (e) {
      // Auto-delete is triggered only when target exchange(or queue) is unbound or deleted.
      // If previous bind fails, we can't ensure auto-delete triggered or not.
      // Below workaround prevents this from happening.
      // caution: Binding x-recent-history exchange to unroutable target causes connection loss.
      // target should be a queue and routable.
      if (sourceDeclared && sourceOpts.autoDelete) {
        await this.channelPool.usingChannel(async channel => {
          await channel.bindQueue(PushService.autoDeleteTriggerQueue.name, source, '');
          await channel.unbindQueue(PushService.autoDeleteTriggerQueue.name, source, '');
        });
      }
      throw e;
    }
  }

  /**
   * unbind exchange wrapper
   * @param destination
   * @param source
   * @param pattern
   * @returns {Promise<any>}
   */
  async unbindExchange(destination: string, source: string, pattern: string = ''): Promise<any> {
    logger.debug(`unbind exchange; ${source} --${pattern}--X ${destination}`);
    return this.channelPool.usingChannel(channel => {
      return channel.unbindExchange(destination, source, pattern, {});
    });
  }

  /**
   * publish message to a player
   * @param pid
   * @param msg
   * @param options
   * @returns {Promise<any>}
   */
  async unicast(pid: string, msg: any, options?: any): Promise<any> {
    return this.channelPool.usingChannel(async channel => {
      const content = noMsgpack && PushService.encode(msg) || this.msgpack.encode(msg);
      return channel.publish(PushService.playerPushExchange.name, pid, content, options);
    });
  }

  /**
   * publish message to specific exchange
   * @param exchange
   * @param msg
   * @param routingKey
   * @param options
   * @returns {Promise<any>}
   */
  async multicast(exchange: string, msg: any, routingKey: string = '', options?: any): Promise<any> {
    return this.channelPool.usingChannel(async channel => {
      const content = noMsgpack && PushService.encode(msg) || this.msgpack.encode(msg);
      return channel.publish(exchange, routingKey, content, options);
    });
  }

  /**
   * publish message to global fanout exchange
   * @param msg message to broadcast. message should be MessagePack encodable.
   * @param options publish options
   * @returns {Promise<any>}
   */
  async broadcast(msg: any, options?: any): Promise<any> {
    return this.channelPool.usingChannel(async channel => {
      const fanout = PushService.broadcastExchange.name;
      const content = noMsgpack && PushService.encode(msg) || this.msgpack.encode(msg);
      return channel.publish(fanout, '', content, options);
    });
  }
}

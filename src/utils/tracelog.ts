import * as Bluebird from 'bluebird';
import { AmqpChannelPoolService } from '../services/amqp-channel-pool-service';


export interface LogSource {
  node: string;
  context: string;
  island: string;
  type: 'rpc' | 'event' | 'endpoint'
}

const TRACE_QUEUE_NAME_OPTIONS: any = {
  durable: false,
  exclusive: false,
  autoDelete: true 
};

export class TraceLog {
  static channelPool: AmqpChannelPoolService;
  static async initialize(): Promise<any> {
    if (!process.env.ISLAND_TRACEMQ_HOST) return;
    if (TraceLog.channelPool) return;
    TraceLog.channelPool = new AmqpChannelPoolService();
    
    await TraceLog.channelPool.initialize({url: process.env.ISLAND_TRACEMQ_HOST});
    return await TraceLog.channelPool.usingChannel(channel => {
      return channel.assertQueue(process.env.ISLAND_TRACEMQ_QUEUE || 'trace', TRACE_QUEUE_NAME_OPTIONS)
    });
  }

  data: {
    tattoo?: string;
    ts: {
      c?: number;
      r?: number;
      e?: number;
    };
    size?: number;
    error?: boolean;
    from?: LogSource;
    to?: LogSource;
  } = {ts: {}};

  constructor (tattoo: string, created: number) {
    this.data.tattoo = tattoo;
    this.data.ts.c = created;
    this.data.ts.r = +(new Date());
  }
  
  set size(size: number) {
    this.data.size = size;
  }
  
  set from(from: LogSource) {
    this.data.from = from;
  }
  
  set to(to: LogSource) {
    this.data.to = to;
  }
  
  end(error?: Error) {
    this.data.ts.e = +(new Date());
    this.data.error = !!error;
  }

  shoot(): Promise<any> {
    if (!TraceLog.channelPool) return;
    return Promise.resolve(Bluebird.try(() => {
      let content = new Buffer(JSON.stringify(this.data), 'utf8');
      let queueName = process.env.ISLAND_TRACEMQ_QUEUE || 'trace';
      return TraceLog.channelPool.usingChannel(channel => {
        return Promise.resolve(channel.sendToQueue(queueName, content));
      });
    }));
  }

  static async purge(): Promise<any> {
    if (!TraceLog.channelPool) return;
    
    await TraceLog.channelPool.purge();
    delete(TraceLog.channelPool);
    return Promise.resolve();
  }
}

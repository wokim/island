import * as Promise from 'bluebird';
import * as _ from 'lodash';
import { logger } from '../utils/logger';

 
export class TraceService {
  private TRACE_QUEUE_NAME_OPTIONS: any = {
    durable: false,
    exclusive: false,
    autoDelete: true 
  };

  initialize(): Promise<any> {
    return Promise.resolve();
  }
 
  private channelWrapper;
 
  constructor(private connection) {
    this.channelWrapper = connection.createChannel({
      setup: channel => {
        return channel.assertQueue(process.env.ISLAND_TRACEMQ_QUEUE || 'trace', this.TRACE_QUEUE_NAME_OPTIONS);
      }
    });
  }
 
  public send(msg: any): Promise<any> {
    return Promise.try(() => {
      let content = new Buffer(JSON.stringify(msg), 'utf8');
      let queueName = process.env.ISLAND_TRACEMQ_QUEUE || 'trace';
      return this.channelWrapper.sendToQueue(queueName, content);
    }).catch((e:Error) => {
        throw e;
    });
  }
}

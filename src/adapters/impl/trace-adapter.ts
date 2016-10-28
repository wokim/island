import * as Promise from 'bluebird';
import ListenableAdapter from '../listenable-adapter';
import { TraceService } from '../../services/trace-service';
import { LogicError, FatalError, ISLAND } from '../../utils/error';
import { logger } from '../../utils/logger';
var amqp = require('amqp-connection-manager');

export interface TraceAdapterOptions {
  serviceName: string;
}

export class TraceAdapter extends ListenableAdapter<TraceService, TraceAdapterOptions> {
  initialize(): Promise<any> {
    var connection = amqp.connect([process.env.ISLAND_TRACEMQ_HOST], { json: true });
    connection.on('connect', (connection) => {
      logger.debug('trace mq connected');
    });
    connection.on('disconnect', function(params) {
      logger.debug('trace mq disconnected', params.err.stack);
    });
    this._adaptee = new TraceService(connection);
    
    return this._adaptee.initialize();
  }

  listen(): Promise<void> {
    return;
  }

  destroy(): Promise<any> {
    return super.destroy();
  }
}

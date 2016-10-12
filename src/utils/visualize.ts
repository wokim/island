import { logger } from '../utils/logger';

export interface LogSource {
  node: string;
  context: string;
  island: string;
  type: 'rpc' | 'event' | 'endpoint'
}

export class VisualizeLog {
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
  
  shoot() {
    logger.debug(JSON.stringify(this, null, 4));
  }
}

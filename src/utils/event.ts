import { Event, EventHandler } from '../services/event-subscriber';
import { SubscriptionOptions } from '../services/event-service';
import { Loggers } from '../utils/loggers';

export interface EventSubscription<T extends Event<U>, U> {
  eventClass: new (args: U) => T;
  handler: EventHandler<T>;
  options: SubscriptionOptions;
}

export namespace Events {
  export namespace Arguments {
    export interface LoggerTypeChanged {
      type: 'short' | 'long' | 'json';
    }

    export interface LoggerLevelChanged {
      category: string;
      level: 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'crit';
    }
  }

  export class LoggerLevelChanged implements Event<Arguments.LoggerLevelChanged> {
    key: string;
    args: Arguments.LoggerLevelChanged;
    constructor(args: Arguments.LoggerLevelChanged) {
      this.key = 'logger.level.changed';
      this.args = args;
    }
  }

  export class LoggerTypeChanged implements Event<Arguments.LoggerTypeChanged> {
    key: string;
    args: Arguments.LoggerTypeChanged;
    constructor(args: Arguments.LoggerTypeChanged) {
      this.key = 'logger.type.changed';
      this.args = args;
    }
  }
}

export const DEFAULT_SUBSCRIPTIONS: EventSubscription<Event<any>, any>[] = [{
    eventClass: Events.LoggerLevelChanged,
    handler: (event: Events.LoggerLevelChanged) => Loggers.switchLevel(event.args.category, event.args.level),
    options: {everyNodeListen: true}
  }, {
    eventClass: Events.LoggerTypeChanged,
    handler: (event: Events.LoggerTypeChanged) => Loggers.switchType(event.args.type),
    options: {everyNodeListen: true}
  }
]

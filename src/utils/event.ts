import { BaseEvent, Event, EventHandler } from '../services/event-subscriber';
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

    export interface SystemNodeStarted {
      name: string;
      island: string;
    }
  }

  export class LoggerLevelChanged extends BaseEvent<Arguments.LoggerLevelChanged> {
    constructor(args: Arguments.LoggerLevelChanged) {
      super('logger.level.changed', args);
    }
  }

  export class LoggerTypeChanged extends BaseEvent<Arguments.LoggerTypeChanged> {
    constructor(args: Arguments.LoggerTypeChanged) {
      super('logger.type.changed', args);
    }
  }
  
  export class SystemNodeStarted extends BaseEvent<Arguments.SystemNodeStarted> {
    constructor(args: Arguments.SystemNodeStarted) {
      super('system.node.started', args);
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

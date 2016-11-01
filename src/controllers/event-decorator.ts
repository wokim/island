import * as Promise from 'bluebird';
import { SubscriptionOptions } from '../services/event-service';
import { Event, EventHandler } from '../services/event-subscriber';
import AbstractController from './abstract-controller';
import { logger } from '../utils/logger';
import { EventSubscription, DEFAULT_SUBSCRIPTIONS } from '../utils/event';

interface PatternSubscription {
  pattern: string;
  handler: EventHandler<any>;
  options: SubscriptionOptions;
}

interface EventSubscriptionContainer<T extends Event<U>, U> {
  _eventSubscriptions: EventSubscription<T, U>[];
}

interface PatternSubscriptionContainer {
  _patternSubscriptions: PatternSubscription[];
}


export function eventController(target: typeof AbstractController) {
  const _onInitialized = target.prototype.onInitialized;
  target.prototype.onInitialized = function() {
    return Promise.resolve(_onInitialized.apply(this))
      .then(result => {
        let constructor = target as typeof AbstractController &
          EventSubscriptionContainer<Event<any>, any> & PatternSubscriptionContainer;

        constructor._eventSubscriptions = DEFAULT_SUBSCRIPTIONS.concat(constructor._eventSubscriptions || []);
        return Promise.map(constructor._eventSubscriptions || [], ({eventClass, handler, options}) => {
            return this.server.subscribeEvent(eventClass, handler.bind(this), options);
          })
          .then(() => Promise.map(constructor._patternSubscriptions || [], ({pattern, handler, options}) => {
            return this.server.subscribePattern(pattern, handler.bind(this), options);
          }))
          .then(() => result);
      });
  };
}

export function subscribeEvent<T extends Event<U>, U>(eventClass: new (args: U) => T, options?: SubscriptionOptions) {
  return function eventSubscriberDecorator(target: any, propertyKey: string, desc: PropertyDescriptor) {
    let constructor = target.constructor as Function & EventSubscriptionContainer<T, U>;
    constructor._eventSubscriptions = constructor._eventSubscriptions || [];
    constructor._eventSubscriptions.push({
      eventClass,
      handler: desc.value,
      options
    });
  };
}

export function subscribePattern(pattern: string, options?: SubscriptionOptions) {
  return function patternSubscriberDecorator(target: any, propertyKey: string, desc: PropertyDescriptor) {
    let constructor = target.constructor as Function & PatternSubscriptionContainer;
    constructor._patternSubscriptions = constructor._patternSubscriptions || [];
    constructor._patternSubscriptions.push({
      pattern,
      handler: desc.value,
      options
    });
  };
}

import { logger } from '../utils/logger';
const cls = require('continuation-local-storage');
import * as amqp from 'amqplib';
import * as Promise from 'bluebird';

export interface Event<T> {
  key: string;
  args: T;
  publishedAt?: Date;
}

export class BaseEvent<T> implements Event<T> {
  publishedAt: Date;
  constructor(public key: string,
              public args: T) {
  }
}

export interface EventHandler<T> {
  (event: T): Promise<any> | any;
}

export interface Message {
  content: Buffer;
  fields: {
    routingKey: string;
  };
  properties: amqp.Options.Publish;
}

export abstract class Subscriber {
  abstract getRoutingPattern(): string;
  abstract isRoutingKeyMatched(routingKey: string): boolean;
  abstract handleEvent(content: any, msg: Message): Promise<any>;
}

export class EventSubscriber extends Subscriber {
  private key: string;

  constructor(private handler: EventHandler<Event<any>>,
              private eventClass: new (args: any) => Event<any>) {
    super();
    let event = new eventClass(null);
    this.key = event.key;
  }

  getRoutingPattern(): string {
    return this.key;
  }

  get routingKey(): string {
    return this.key;
  }

  isRoutingKeyMatched(routingKey: string): boolean {
    return routingKey === this.key;
  }

  handleEvent(content: any, msg: Message): Promise<any> {
    let event = new this.eventClass(content);
    event.publishedAt = new Date(msg.properties.timestamp);
    return Promise.resolve(this.handler(event));
  }
}

export class PatternSubscriber extends Subscriber {
  private regExp: RegExp;

  constructor(private handler: EventHandler<Event<any>>,
              private pattern: string) {
    super();
    this.regExp = this.convertRoutingKeyPatternToRegexp(pattern);
  }

  getRoutingPattern(): string {
    return this.pattern;
  }

  private convertRoutingKeyPatternToRegexp(pattern: string): RegExp {
    let regexPattern = pattern
      .replace('.', '\\.')        // dot(.) is separator
      .replace('*', '\\w+')       // star(*) means one word exactly
      .replace('#', '[\\w\\.]*'); // hash(#) means zero or more words, including dot(.)
    return new RegExp(`^${regexPattern}$`);
  }

  isRoutingKeyMatched(routingKey: string): boolean {
    return this.regExp.test(routingKey);
  }

  handleEvent(content: any, msg: Message): Promise<any> {
    return Promise.resolve(this.handler({
      key: msg.fields.routingKey, 
      args: content,
      publishedAt: new Date(msg.properties.timestamp)
    }));
  }
}

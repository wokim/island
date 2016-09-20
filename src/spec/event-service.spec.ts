import { AmqpChannelPoolService } from '../services/amqp-channel-pool-service';
import { EventService } from '../services/event-service';
import { Event, PatternSubscriber } from '../services/event-subscriber';
import * as Bluebird from 'bluebird';

class BaseEvent<T> implements Event<T> {
  publishedAt: Date;
  constructor(public key: string,
              public args: T) {
  }
}

class TestEvent extends BaseEvent<string> {
  constructor(args: string) {
    super('test.event', args);
  }
}

class TestPatternEvent extends BaseEvent<string> {
  constructor(args: string) {
    super('test.pattern', args);
  }
}

describe('EventService', () => {
  let amqpChannelPool = new AmqpChannelPoolService();
  let eventService = new EventService(`event-service-spec`);

  beforeAll(done => {
    amqpChannelPool.initialize({
        url: process.env.RABBITMQ_HOST || 'amqp://rabbitmq:5672',
      })
      .then(() => eventService.initialize(amqpChannelPool))
      .then(() => eventService.startConsume())
      .then(done)
      .catch(done.fail);
  });
  
  it('can publish an event', done => {
    eventService.publishEvent(new TestEvent('aaa'))
      .then(done)
      .catch(done.fail);
  });

  it('can subscribe the event', done => {
    eventService.subscribeEvent(TestEvent, (event: TestEvent) => {
        expect(event.args).toBe('bbb');
        setTimeout(done, 500);
      })
      .then(() => eventService.publishEvent(new TestEvent('bbb')))
      .catch(done.fail);
  });

  it('can unsubscribe the event', done => {
    pending('not implemented');
  });

  it('can subscribe the event by a pattern', done => {
    eventService.subscribePattern('test.pattern', (event: TestPatternEvent) => {
        expect(event.key).toBe('test.pattern');
        setTimeout(done, 500);
      })
      .then(() => eventService.publishEvent(new TestPatternEvent('ccc')))
      .catch(done.fail);
  });

  it('can subscribe the event by an wildcard pattern', done => {
    eventService.subscribePattern('test.*', (event: TestPatternEvent) => {
        expect(event.key).toBe('test.pattern');
        expect(event.args).toBe('wildcard');
        setTimeout(done, 500);
      })
      .then(() => eventService.publishEvent(new TestPatternEvent('wildcard')))
      .catch(done.fail);
  });

  afterAll(done => {
    eventService.purge()
      .then(() => amqpChannelPool.purge())
      .then(done)
      .catch(done.fail);
  });
});

describe('PatternSubscriber', () => {
  describe('isRoutingKeyMatched', () => {
    it('should test a pattern with plain text', () => {
      let s = new PatternSubscriber(event => {
      }, 'aaa.aaa.aaa');
      expect(s.isRoutingKeyMatched('aaa.aaa.aaa')).toBeTruthy();
      expect(s.isRoutingKeyMatched('aaa.aaa.bbb')).toBeFalsy();
    });

    it('should test a pattern using *', () => {
      let s = new PatternSubscriber(event => {
      }, 'aaa.aaa.*');
      expect(s.isRoutingKeyMatched('aaa.aaa.aaa')).toBeTruthy();
      expect(s.isRoutingKeyMatched('aaa.aaa.bbb')).toBeTruthy();
      expect(s.isRoutingKeyMatched('aaa.bbb.aaa')).toBeFalsy();
      expect(s.isRoutingKeyMatched('aaa.aaa.aaa.aaa')).toBeFalsy();
    });

    it('should test a pattern using #', () => {
      let s = new PatternSubscriber(event => {
      }, 'aaa.#');
      expect(s.isRoutingKeyMatched('aaa.aaa.aaa')).toBeTruthy();
      expect(s.isRoutingKeyMatched('aaa.bbb.bbb')).toBeTruthy();
      expect(s.isRoutingKeyMatched('aaa.bbb')).toBeTruthy();
      expect(s.isRoutingKeyMatched('aaa')).toBeFalsy();
      expect(s.isRoutingKeyMatched('ccc.aaa.bbb')).toBeFalsy();
    });
  });
});


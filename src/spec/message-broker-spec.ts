import MessageBrokerService from '../services/message-broker-service';
import * as amqp from 'amqplib';
import Promise = require('bluebird');

describe('msg-broker test:', () => {
  var brokerService1: MessageBrokerService;
  var brokerService2: MessageBrokerService;
  beforeAll(done => {
    amqp.connect(process.env.RABBITMQ_HOST || 'amqp://192.168.99.100:5672')
      .then((conn: amqp.Connection) => {
        brokerService1 = new MessageBrokerService(conn, 'service1');
        brokerService2 = new MessageBrokerService(conn, 'service2');
        Promise.all([brokerService1.initialize(), brokerService2.initialize()])
          .then(() => {
            return Promise.all([brokerService1.startConsume(), brokerService2.startConsume()]);
          })
          .then(() => done());
      });
  });

  var pattern = 'aaa.bbb.ccc';

  it('can send a message', done => {
    brokerService1.subscribe(pattern, msg => {
      expect(msg.hello).toBe('world');
      brokerService1.unsubscribe(pattern).then(() => done());
    })
      .then((res) => brokerService2.publish(pattern, {hello: 'world'}))
      .catch(err => done.fail(err));
  });

  it('can send a pattern message #1', done => {
    brokerService1.subscribe('#.ccc', msg => {
      expect(msg.hello).toBe('world');
      brokerService1.unsubscribe('#.ccc').then(() => done());
    }).then(() => {
      brokerService2.publish(pattern, {hello: 'world'});
    }).catch(err => done.fail(err));
  });

  it('can send a pattern message #2', done => {
    brokerService1.subscribe('*.bbb.ccc', msg => {
      expect(msg.hello).toBe('world');
      brokerService1.unsubscribe('*.bbb.ccc').then(() => done());
    }).then(() => {
      brokerService2.publish(pattern, {hello: 'world'});
    }).catch(err => done.fail(err));
  });

  afterAll(done => {
    Promise.all([brokerService1.purge(), brokerService2.purge()]).then(() => done()).catch(done.fail);
  });
});

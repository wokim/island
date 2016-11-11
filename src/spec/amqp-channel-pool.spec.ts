import { AmqpChannelPoolService } from '../services/amqp-channel-pool-service';

describe('AmqpChannelPool', () => {
  let amqpChannelPool = new AmqpChannelPoolService();

  beforeAll(done => {
    amqpChannelPool.initialize({
        url: process.env.RABBITMQ_HOST || 'amqp://rabbitmq:5672',
      })
      .then(done)
      .catch(done.fail);
  });

  it('can acquire a channel and release it', done => {
    amqpChannelPool.acquireChannel()
      .then(channel => {
        expect(channel).not.toBeUndefined();
        let exchange = `spec.temp.${+new Date()}`;
        Promise.resolve(channel.assertExchange(exchange, 'fanout', {autoDelete: true}))
          .then(() => channel.deleteExchange(exchange))
          .then(() => amqpChannelPool.releaseChannel(channel));
      })
      .then(done)
      .catch(done.fail);
  });

  it('can use channel disposer', done => {
    amqpChannelPool.usingChannel(channel => {
        let exchange = `spec.temp.${+new Date()}`;
        return channel.assertExchange(exchange, 'fanout', {autoDelete: true})
          .then(() => channel.deleteExchange(exchange));
      })
      .then(done)
      .catch(done.fail);
  });

  afterAll(done => {
    amqpChannelPool.purge()
      .then(done)
      .catch(done.fail);
  });
});

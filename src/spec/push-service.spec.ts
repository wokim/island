import Bluebird = require('bluebird');
import { AmqpChannelPoolService } from '../services/amqp-channel-pool-service';
import PushService from '../services/push-service';
import MessagePack from '../utils/msgpack';

describe('PushService test : ', () => {
  const pushService = new PushService();
  const amqpChannelPool = new AmqpChannelPoolService();
  let msgpack: MessagePack;
  msgpack = MessagePack.getInst();

  let destination_exchange = 'dddddd_ex';
  let destination_queue = 'dddddd_que';
  let source_queue = "ssssss_que";
  let source_exchange = "ssssss_ex";

  beforeAll(done => {    
    const url = process.env.RABBITMQ_HOST || 'amqp://rabbitmq:5672';
    
    return amqpChannelPool.initialize({url})
      .then(() => pushService.initialize(amqpChannelPool))
      .then(() =>
        amqpChannelPool.usingChannel(channel => {
          channel.assertQueue(source_queue, {} );
          channel.assertQueue(destination_queue, {} );
          channel.assertExchange(destination_exchange, 'fanout', {durable: true, autoDelete: true} );
          return channel.assertExchange(source_exchange, 'fanout', {durable: true, autoDelete: true} );
        })
        .then(() => amqpChannelPool.usingChannel(channel => {
          channel.bindQueue(destination_queue, destination_exchange, '');
          return channel.bindQueue(source_queue, source_exchange, '');
        }))
        .then(() => {
          return pushService.bindExchange(destination_exchange, source_exchange);
        }) 
      )
      .then(() => done());
  });

  afterAll(done => {
    pushService.unbindExchange(destination_exchange, source_exchange)
    .then(() =>
      pushService.deleteExchange(destination_exchange)
    )
    .then(() => 
        pushService.deleteExchange(source_exchange)
    )
    .then(() =>
      pushService.purge()
    )
    .then(() => amqpChannelPool.purge())
    .then(done)
    .catch(done.fail);
  });
  

  it('push test #1: unicast test', done => {
    let msg = 'testMessage';
    //let pattern = "pattern";
    amqpChannelPool.usingChannel(channel => {
        return channel.consume(destination_queue, (content) => {        
            //console.log("========= dest_que : ", msgpack.decode(content.content));  
            expect(msgpack.decode(content.content)).toBe('testMessage');
        })
    }).then(() => {
        //console.log("========= send : ", msg);  
        return pushService.unicast(source_exchange, msg);
    })
    .then(done, done.fail);
  });

  it('push test #2: multicast test', done => {
    let msg = 'testMessage';
    //let pattern = "pattern";
    amqpChannelPool.usingChannel(channel => {
        return channel.consume(destination_queue, (content) => {        
            //console.log("========= dest_que : ", msgpack.decode(content.content));  
            expect(msgpack.decode(content.content)).toBe('testMessage');
        })
    }).then(() => {
        //console.log("========= send : ", msg);  
        return pushService.multicast(source_exchange, msg);
    })
    .then(done, done.fail);
  });

  it('push test #3: msgpack Error test', () => {
    expect(() => {
        new MessagePack();
    }).toThrow();
  });

  it('push test #4: msgpack Encode test', () => {
    expect(() => {
      msgpack.encode(undefined);
    }).toThrow();
  });
 
  it('push test #5: msgpack Encode Date test', done => {
    let content = new Date();
    //console.log("------ date : ", content);
    return Bluebird.try(() => {
      msgpack.encode(content);
    })
    .catch(err => {
      console.log("msgpack Encode Date test : ", err);
      return;
    })
    .then(done, done.fail); 
  });

  it('push test #6: msgpack Encode Error test', done => {
    let content = new Error("test Err");
    //console.log("------ Err : ", content);
    return Bluebird.try(() => {
      msgpack.encode(content);
    })
    .catch(err => {
      console.log("msgpack Encode Error test : ", err);
      return;
    })
    .then(done, done.fail); 
  });
  
});
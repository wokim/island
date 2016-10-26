require('source-map-support').install();
import RPCService from '../services/rpc-service';
import * as amqp from 'amqplib';
import Promise = require('bluebird');
import { AmqpChannelPoolService } from '../services/amqp-channel-pool-service';


describe('RPC test:', () => {
  const rpcService = new RPCService('haha');
  const amqpChannelPool = new AmqpChannelPoolService();
  beforeAll(done => {
    const url = process.env.RABBITMQ_HOST || 'amqp://rabbitmq:5672';
    return amqpChannelPool.initialize({url})
      .then(() => rpcService.initialize(amqpChannelPool))
      .then(() => done());
  });

  afterAll(done => {
    rpcService.purge()
      .then(() => amqpChannelPool.purge())
      .then(done)
      .catch(done.fail);
  });

  it('rpc test #1: rpc call', done => {
    rpcService.register('testMethod', (msg) => {
      expect(msg).toBe('hello');
      return Promise.resolve('world');
    }, 'rpc').then(() => {
      rpcService.invoke<string, string>('testMethod', 'hello').then(res => {
        expect(res).toBe('world');
        done();
      });
    });
  });

  it('rpc test #2: rpc call again', done => {
    rpcService.invoke<string, string>('testMethod', 'hello').then(res => {
      expect(res).toBe('world');
      done();
    });
  });

  it('rpc test #3: purge', done => {
    rpcService.unregister('testMethod').then(() => done()).catch(err => done.fail(err));
  });

  it('rpc test #4: reject test', done => {
    rpcService.register('testMethod', (msg) => {
      expect(msg).toBe('hello');
      return Promise.reject(new Error('custom error'));
    }, 'rpc').then(() => {
      rpcService.invoke<string, string>('testMethod', 'hello').catch((err: Error) => {
        // [FIXME] 뭔가 이상하다 @kson //2016-08-23
        expect(err.message).toBe(`code: haha.ETC.F0001, msg: custom error'`);
        rpcService.unregister('testMethod').then(() => done()).catch(err => done.fail(err));
      });
    });
  });

  it('rpc test #5: 메시지를 하나 처리하고 있는 사이에 삭제 시도', done => {
    rpcService.register('testMethod', (msg) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve('world'), parseInt(msg, 10));
      });
    }, 'rpc').then(() => {
      const promises = [
        rpcService.invoke('testMethod', 1000),
        rpcService.invoke('testMethod', 100).then(res => {
          // 하나는 아직 처리중인데 unregister 시도를 해본다
          rpcService.unregister('testMethod');
          return res;
        })
      ];
      Promise.all(promises).then(() => done()).catch(done.fail);
    });
  });

  it('rpc 등록해두고 모조리 다 취소시키기', done => {
    Promise.all([
      rpcService.register('AAA', (msg) => {
        return new Promise((resolve, reject) => {
          rpcService.purge();
          setTimeout(() => resolve('world'), parseInt(msg, 10));
        });
      }, 'rpc'),
      rpcService.register('BBBB', (msg) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve('world'), parseInt(msg, 10));
        });
      }, 'rpc')
    ]).then(() => {
      return rpcService.invoke('AAA', 2000);
    }).then(() => {
      done();
    }).catch(done.fail);
  }, 10000);
});

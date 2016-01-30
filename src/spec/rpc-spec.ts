/// <reference path="../../typings/jasmine/jasmine.d.ts" />
require('source-map-support').install();
import RPCService from '../services/rpc-service';
import amqp = require('amqplib/callback_api');
import Promise = require('bluebird');

xdescribe('RPC test:', () => {
  var rpcService: RPCService;
  beforeAll(done => {
    amqp.connect('amqp://192.168.99.100:5672', (err, conn: amqp.Connection) => {
      if (err) return done.fail(err);
      rpcService = new RPCService(conn);
      done();
    });
  });

  it('rpc test #1: rpc call', done => {
    rpcService.register('testMethod', (msg) => {
      expect(msg).toBe('hello');
      return Promise.resolve('world');
    }).then(() => {
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
    }).then(() => {
      rpcService.invoke<string, string>('testMethod', 'hello').catch((err: Error) => {
        expect(err.message).toBe('custom error');
        rpcService.unregister('testMethod').then(() => done()).catch(err => done.fail(err));
      });
    });
  });

  it('rpc test #5: 메시지를 하나 처리하고 있는 사이에 삭제 시도', done => {
    rpcService.register('testMethod', (msg) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve('world'), parseInt(msg, 10));
      });
    }).then(() => {
      rpcService.invoke('testMethod', 5000);
      rpcService.invoke('testMethod', 100).then(() => {
        // 하나는 아직 처리중인데 unregister 시도를 해본다
        return rpcService.unregister('testMethod');
      }).then(() => done()).catch(done.fail);
    });
  });

  it('rpc 등록해두고 모조리 다 취소시키기', done => {
    Promise.all([
      rpcService.register('AAA', (msg) => {
        return new Promise((resolve, reject) => {
          rpcService.purge();
          setTimeout(() => resolve('world'), parseInt(msg, 10));
        });
      }),
      rpcService.register('BBBB', (msg) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve('world'), parseInt(msg, 10));
        });
      })
    ]).then(() => {
      return rpcService.invoke('AAA', 2000);
    }).then(() => {
      done();
    }).catch(done.fail);
  }, 10000);
});

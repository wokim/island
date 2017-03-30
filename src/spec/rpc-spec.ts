// tslint:disable-next-line
require('source-map-support').install();
process.env.ISLAND_RPC_WAIT_TIMEOUT_MS = 3000;
process.env.ISLAND_SERVICE_LOAD_TIME_MS = 1000;

import Bluebird = require('bluebird');

import { RpcOptions } from '../controllers/rpc-decorator';
import paramSchemaInspector from '../middleware/schema.middleware';
import { AmqpChannelPoolService } from '../services/amqp-channel-pool-service';
import RPCService, { RpcRequest } from '../services/rpc-service';
import { TraceLog } from '../utils/tracelog';

describe('RPC test:', () => {
  const rpcService = new RPCService('haha');
  const amqpChannelPool = new AmqpChannelPoolService();
  beforeAll(done => {
    const url = process.env.RABBITMQ_HOST || 'amqp://rabbitmq:5672';
    return amqpChannelPool.initialize({ url })
      .then(() => rpcService.initialize(amqpChannelPool))
      .then(() => done());
  });

  afterAll(done => {
    rpcService.purge()
      .then(() => amqpChannelPool.purge())
      .then(() => TraceLog.purge())
      .then(done)
      .catch(done.fail);
  });

  it('rpc test #1: rpc call', done => {
    return rpcService.register('testMethod', msg => {
      expect(msg).toBe('hello');
      return Promise.resolve('world');
    }, 'rpc').then(() => {
      return rpcService.invoke<string, string>('testMethod', 'hello').then(res => {
        expect(res).toBe('world');
        done();
      });
    });
  });

  it('rpc test #2: rpc call again', done => {
    return rpcService.invoke<string, string>('testMethod', 'hello').then(res => {
      expect(res).toBe('world');
      done();
    });
  });

  it('rpc test #3: purge', done => {
    return rpcService.unregister('testMethod').then(() => done()).catch(err => done.fail(err));
  });

  it('rpc test #4: reject test', done => {
    return rpcService.register('testMethod', msg => {
      expect(msg).toBe('hello');
      return Promise.reject(new Error('custom error'));
    }, 'rpc').then(() => {
      return rpcService.invoke<string, string>('testMethod', 'hello').catch((err: Error) => {
        expect(err.message).toBe(`code: haha.ETC.F0001, msg: custom error'`);
        rpcService.unregister('testMethod').then(() => done()).catch(err => done.fail(err));
      });
    });
  });

  it('rpc test #5: 메시지를 하나 처리하고 있는 사이에 삭제 시도', done => {
    return rpcService.register('testMethod', msg => {
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

  it('rpc test #6: 등록해두고 모조리 다 취소시키기', done => {
    return Promise.all([
      rpcService.register('AAA', msg => {
        return new Promise((resolve, reject) => {
          rpcService.purge();
          setTimeout(() => resolve('world'), parseInt(msg, 10));
        });
      }, 'rpc'),
      rpcService.register('BBBB', msg => {
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

  it('rpc test #7: rpc call with sanitizatioin, validation', done => {
    // Sanitization Schema
    const sanitization = {
      type: 'string'
    };
    // Validation Schema
    const validation = {
      type: 'string'
    };

    const rpcoptions: RpcOptions = {
      schema: {
        query: { sanitization, validation },
        result: { sanitization, validation }
      }
    };
    return rpcService.register('testSchemaMethod', msg => {
      expect(msg).toBe('hello');
      return Promise.resolve('world');
    }, 'rpc', rpcoptions).then(() => {
      return rpcService.invoke<string, string>('testSchemaMethod', 'hello').then(res => {
        expect(res).toBe('world');
        done();
      });
    });
  });

  it('rpc test #8: rpc call with paramSchemaInspector', done => {
    // Validation Schema
    const validation = {
      type: 'string'
    };
    const rpcoptions: RpcOptions = {
      schema: {
        query: { sanitization: {}, validation },
        result: { sanitization: {}, validation }
      }
    };
    const req: RpcRequest = {
      msg: {},
      name: 'test',
      options: rpcoptions
    };

    return Bluebird.try(() => {
      paramSchemaInspector(req);
    })
      .catch(err => {
        console.log('rpc paramSchemaInspector test : ', err);
        return;
      })
      .then(done, done.fail);
  });

  it('should unregister handlers if it failed to send a message', done => {
    const usingChannel = amqpChannelPool.usingChannel;
    (amqpChannelPool as any).usingChannel = cb => {
      cb({
        sendToQueue: (name, content, options) => { throw new Error('haha'); }
      });
    };

    rpcService.invoke<string, string>('testMethod', 'hello')
      .then(() => {
        expect(true).toEqual(false);
      })
      .catch(e => {
        expect(e.message).toEqual('haha');
      })
      .then(() => {
        expect((rpcService as any).reqTimeouts).toEqual({});
        expect((rpcService as any).reqExecutors).toEqual({});
        amqpChannelPool.usingChannel = usingChannel;
        done();
      });
  });

  it('should keeping a constant queue during restart the service', done => {
    return rpcService.register('testMethod3', msg => {
      return Promise.resolve('world');
    }, 'rpc').then(() => {
      return rpcService.purge()
        .then(() => amqpChannelPool.purge())
        .then(() => TraceLog.purge());
    }).then(() => {
      const url = process.env.RABBITMQ_HOST || 'amqp://rabbitmq:5672';
      return amqpChannelPool.initialize({ url })
        .then(() => rpcService.initialize(amqpChannelPool));
    }).then(() => {
      setTimeout(() => {
          return rpcService.register('testMethod3', msg => {
            return Promise.resolve('world');
          }, 'rpc');
        }, parseInt(process.env.ISLAND_RPC_WAIT_TIMEOUT_MS, 10) / 2);
      return rpcService.invoke<string, string>('testMethod3', 'hello').then(res => {
        expect(res).toBe('world');
        done();
      });
    });
  });
});

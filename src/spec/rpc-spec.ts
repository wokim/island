require('source-map-support').install();
import RPCService, {RpcRequest} from '../services/rpc-service';
import { RpcOptions } from '../controllers/rpc-decorator';
import * as amqp from 'amqplib';
import Promise = require('bluebird');
import { AmqpChannelPoolService } from '../services/amqp-channel-pool-service';
import { TraceLog } from '../utils/tracelog';
import paramSchemaInspector from '../middleware/schema.middleware'

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
      .then(() => TraceLog.purge())      
      .then(done)
      .catch(done.fail);
  });

  it('rpc test #1: rpc call', done => {
    return rpcService.register('testMethod', (msg) => {
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
    return rpcService.register('testMethod', (msg) => {
      expect(msg).toBe('hello');
      return Promise.reject(new Error('custom error'));
    }, 'rpc').then(() => {
      return rpcService.invoke<string, string>('testMethod', 'hello').catch((err: Error) => {
        // [FIXME] 뭔가 이상하다 @kson //2016-08-23
        expect(err.message).toBe(`code: haha.ETC.F0001, msg: custom error'`);
        rpcService.unregister('testMethod').then(() => done()).catch(err => done.fail(err));
      });
    });
  });

  it('rpc test #5: 메시지를 하나 처리하고 있는 사이에 삭제 시도', done => {
    return rpcService.register('testMethod', (msg) => {
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

  it('rpc test #7: rpc call with sanitizatioin, validation', done => {
    // Sanitization Schema
    let sanitization = {
      type: 'string'
    };
    // Validation Schema
    let validation = {
      type: 'string'
    };

    let rpcoptions:RpcOptions = {schema:{
      query:{sanitization:sanitization, validation:validation}, 
      result:{sanitization:sanitization, validation:validation}}
    };
    
    return rpcService.register('testMethod', (msg) => {
      expect(msg).toBe('hello');
      return Promise.resolve('world');
    }, 'rpc', rpcoptions).then(() => {
      return rpcService.invoke<string, string>('testMethod', 'hello').then(res => {
        expect(res).toBe('world');
        done();
      });
    });
  })

  it('rpc test #8: rpc call with paramSchemaInspector', done => {
    // Validation Schema
    let validation = {
      type: 'string'
    };
    let rpcoptions:RpcOptions = {schema:{
      query:{sanitization:{}, validation:validation}, 
      result:{sanitization:{}, validation:validation}}
    };
    let req:RpcRequest = {
      name: 'test',
      msg: {},
      options: rpcoptions
    }
    
    return Promise.try(() => {
      paramSchemaInspector(req);    
    })
    .catch(err => {
      console.log("rpc paramSchemaInspector test : ", err);
      return;
    })
    .then(done, done.fail);   
  })

});

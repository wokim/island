/// <reference path="../../typings/jasmine/jasmine.d.ts" />
require('source-map-support').install();
import PushService from '../services/push-service-refactor';
import amqp = require('amqplib');
import Promise = require('bluebird');

xdescribe('push test:', () => {
  var pushService: PushService;
  beforeAll(done => {
    amqp.connect('amqp://192.168.99.100:5672')
      .then((conn: amqp.Connection) => {
        pushService = new PushService(conn);
        pushService.initialize().then(() => done());
      }).catch(done.fail);
  });

  var sid = 'xxxxxxxxxxxxx';
  var aid = 'aaaaaaaaaaaaa';
  var pid = 'bbbbbbbbbbbbb';

  it('push test #1: bindAccount', done => {
    pushService.bindAccount(sid, aid).then(() => done()).catch(err => done.fail(err));
  });

  it('push test #2: bindPlayer', done => {
    pushService.bindPlayer(sid, pid).then(() => done()).catch(err => done.fail(err));
  });

  // NOTE: autoDelete 옵션이 있기때문에 컨슈머가 제거되는 순간 queue가 삭제된다
  // 실제 코드에서도 consume은 한번만 하고 cancel은 소켓 끊어져서 클린업 할 때 호출됨
  it('push test #3: send using aid/pid/broadcast', done => {
    let consumer;
    let messages = {world: 1, there: 1, broadcast: 1};
    pushService.consume(sid, (msg, decoded) => {
      delete messages[decoded.hello];
      if (Object.keys(messages).length === 0) done();
    }).then(consumerInfo => {
      consumer = consumerInfo;
      pushService.unicast(aid, { hello: 'world' });
      pushService.unicast(pid, { hello: 'there' });
      pushService.broadcast({ hello: 'broadcast' });
    });
  });

  xit('push test #4: send using pid', done => {
    let consumer;
    pushService.consume(sid, (msg, decoded) => {
      expect(decoded.hello).toBe('there');
      pushService.cancel(consumer);
      done();
    }).then(consumerInfo => {
      consumer = consumerInfo;
      pushService.unicast(pid, { hello: 'there' });
    });
  });

  xit('push test #5: broadcast', done => {
    let consumer;
    pushService.consume(sid, (msg, decoded) => {
      expect(decoded.hello).toBe('broadcast');
      pushService.cancel(consumer);
      done();
    }).then(consumerInfo => {
      consumer = consumerInfo;
      pushService.broadcast({ hello: 'broadcast' });
    });
  });

  it ('push test #6: unbindPlayer', done => {
    pushService.unbindPlayer(sid, pid).then(() => done()).catch(err => done.fail(err));
  });

  it ('push test #7: unbindAccount', done => {
    pushService.unbindAccount(sid, aid).then(() => done()).catch(err => done.fail(err));
  });
});

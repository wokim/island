/// <reference path="../../typings/jasmine/jasmine.d.ts" />
require('source-map-support').install();
var push_service_refactor_1 = require('../services/push-service-refactor');
var amqp = require('amqplib');
xdescribe('push test:', function () {
    var pushService;
    beforeAll(function (done) {
        amqp.connect('amqp://192.168.99.100:5672')
            .then(function (conn) {
            pushService = new push_service_refactor_1.default(conn);
            pushService.initialize().then(function () { return done(); });
        }).catch(done.fail);
    });
    var sid = 'xxxxxxxxxxxxx';
    var aid = 'aaaaaaaaaaaaa';
    var pid = 'bbbbbbbbbbbbb';
    it('push test #1: bindAccount', function (done) {
        pushService.bindAccount(sid, aid).then(function () { return done(); }).catch(function (err) { return done.fail(err); });
    });
    it('push test #2: bindPlayer', function (done) {
        pushService.bindPlayer(sid, pid).then(function () { return done(); }).catch(function (err) { return done.fail(err); });
    });
    // NOTE: autoDelete 옵션이 있기때문에 컨슈머가 제거되는 순간 queue가 삭제된다
    // 실제 코드에서도 consume은 한번만 하고 cancel은 소켓 끊어져서 클린업 할 때 호출됨
    it('push test #3: send using aid/pid/broadcast', function (done) {
        var consumer;
        var messages = { world: 1, there: 1, broadcast: 1 };
        pushService.consume(sid, function (msg, decoded) {
            delete messages[decoded.hello];
            if (Object.keys(messages).length === 0)
                done();
        }).then(function (consumerInfo) {
            consumer = consumerInfo;
            pushService.unicast(aid, { hello: 'world' });
            pushService.unicast(pid, { hello: 'there' });
            pushService.broadcast({ hello: 'broadcast' });
        });
    });
    xit('push test #4: send using pid', function (done) {
        var consumer;
        pushService.consume(sid, function (msg, decoded) {
            expect(decoded.hello).toBe('there');
            pushService.cancel(consumer);
            done();
        }).then(function (consumerInfo) {
            consumer = consumerInfo;
            pushService.unicast(pid, { hello: 'there' });
        });
    });
    xit('push test #5: broadcast', function (done) {
        var consumer;
        pushService.consume(sid, function (msg, decoded) {
            expect(decoded.hello).toBe('broadcast');
            pushService.cancel(consumer);
            done();
        }).then(function (consumerInfo) {
            consumer = consumerInfo;
            pushService.broadcast({ hello: 'broadcast' });
        });
    });
    it('push test #6: unbindPlayer', function (done) {
        pushService.unbindPlayer(sid, pid).then(function () { return done(); }).catch(function (err) { return done.fail(err); });
    });
    it('push test #7: unbindAccount', function (done) {
        pushService.unbindAccount(sid, aid).then(function () { return done(); }).catch(function (err) { return done.fail(err); });
    });
});
//# sourceMappingURL=push-spec.js.map
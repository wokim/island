/// <reference path="../../typings/jasmine/jasmine.d.ts" />
var message_broker_service_1 = require('../services/message-broker-service');
var amqp = require('amqplib/callback_api');
var Promise = require('bluebird');
xdescribe('msg-broker test:', function () {
    var brokerService1;
    var brokerService2;
    beforeAll(function (done) {
        amqp.connect('amqp://192.168.99.100:5672', function (err, conn) {
            if (err)
                return done.fail(err);
            brokerService1 = new message_broker_service_1.default(conn, 'service1');
            brokerService2 = new message_broker_service_1.default(conn, 'service2');
            Promise.all([brokerService1.initialize(), brokerService2.initialize()]).then(function () { return done(); });
        });
    });
    var pattern = 'aaa.bbb.ccc';
    it('can send a message', function (done) {
        brokerService1.subscribe(pattern, function (msg) {
            expect(msg.hello).toBe('world');
            brokerService1.unsubscribe(pattern).then(function () { return done(); });
        }).then(function () {
            brokerService2.publish(pattern, { hello: 'world' });
        }).catch(function (err) { return done.fail(err); });
    });
    it('can send a pattern message #1', function (done) {
        brokerService1.subscribe('#.ccc', function (msg) {
            expect(msg.hello).toBe('world');
            brokerService1.unsubscribe('#.ccc').then(function () { return done(); });
        }).then(function () {
            brokerService2.publish(pattern, { hello: 'world' });
        }).catch(function (err) { return done.fail(err); });
    });
    it('can send a pattern message #2', function (done) {
        brokerService1.subscribe('*.bbb.ccc', function (msg) {
            expect(msg.hello).toBe('world');
            brokerService1.unsubscribe('*.bbb.ccc').then(function () { return done(); });
        }).then(function () {
            brokerService2.publish(pattern, { hello: 'world' });
        }).catch(function (err) { return done.fail(err); });
    });
    afterAll(function (done) {
        Promise.all([brokerService1.purge(), brokerService2.purge()]).then(function () { return done(); }).catch(done.fail);
    });
});
//# sourceMappingURL=message-broker-spec.js.map
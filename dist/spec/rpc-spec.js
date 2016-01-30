/// <reference path="../../typings/jasmine/jasmine.d.ts" />
require('source-map-support').install();
var rpc_service_1 = require('../services/rpc-service');
var amqp = require('amqplib/callback_api');
var Promise = require('bluebird');
xdescribe('RPC test:', function () {
    var rpcService;
    beforeAll(function (done) {
        amqp.connect('amqp://192.168.99.100:5672', function (err, conn) {
            if (err)
                return done.fail(err);
            rpcService = new rpc_service_1.default(conn);
            done();
        });
    });
    it('rpc test #1: rpc call', function (done) {
        rpcService.register('testMethod', function (msg) {
            expect(msg).toBe('hello');
            return Promise.resolve('world');
        }).then(function () {
            rpcService.invoke('testMethod', 'hello').then(function (res) {
                expect(res).toBe('world');
                done();
            });
        });
    });
    it('rpc test #2: rpc call again', function (done) {
        rpcService.invoke('testMethod', 'hello').then(function (res) {
            expect(res).toBe('world');
            done();
        });
    });
    it('rpc test #3: purge', function (done) {
        rpcService.unregister('testMethod').then(function () { return done(); }).catch(function (err) { return done.fail(err); });
    });
    it('rpc test #4: reject test', function (done) {
        rpcService.register('testMethod', function (msg) {
            expect(msg).toBe('hello');
            return Promise.reject(new Error('custom error'));
        }).then(function () {
            rpcService.invoke('testMethod', 'hello').catch(function (err) {
                expect(err.message).toBe('custom error');
                rpcService.unregister('testMethod').then(function () { return done(); }).catch(function (err) { return done.fail(err); });
            });
        });
    });
    it('rpc test #5: 메시지를 하나 처리하고 있는 사이에 삭제 시도', function (done) {
        rpcService.register('testMethod', function (msg) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () { return resolve('world'); }, parseInt(msg, 10));
            });
        }).then(function () {
            rpcService.invoke('testMethod', 5000);
            rpcService.invoke('testMethod', 100).then(function () {
                // 하나는 아직 처리중인데 unregister 시도를 해본다
                return rpcService.unregister('testMethod');
            }).then(function () { return done(); }).catch(done.fail);
        });
    });
    it('rpc 등록해두고 모조리 다 취소시키기', function (done) {
        Promise.all([
            rpcService.register('AAA', function (msg) {
                return new Promise(function (resolve, reject) {
                    rpcService.purge();
                    setTimeout(function () { return resolve('world'); }, parseInt(msg, 10));
                });
            }),
            rpcService.register('BBBB', function (msg) {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () { return resolve('world'); }, parseInt(msg, 10));
                });
            })
        ]).then(function () {
            return rpcService.invoke('AAA', 2000);
        }).then(function () {
            done();
        }).catch(done.fail);
    }, 10000);
});
//# sourceMappingURL=rpc-spec.js.map
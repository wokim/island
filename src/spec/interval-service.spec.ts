import * as Bluebird from 'bluebird';
import { jasmineAsyncAdapter as spec } from '../utils/jasmine-async-support';
import { logger } from '../utils/logger';

import { IntervalHelper } from '../utils/interval-helper';

async function testFunction() {
    await Bluebird.delay(3000);
    logger.debug('test Interval Function Working!');
}

describe('IntervalService', () => {
    afterEach(spec(async () => {
        await Bluebird.delay(500);
        await IntervalHelper.purge();
    }));

    it('can use island Interval', spec(async () => {
        await IntervalHelper.setIslandInterval(testFunction, 1000);
        const res = await IntervalHelper.getIntervalList();
        expect(res.length).toBe(1);
    }));

    it('can register multiple Interval', spec(async () => {
        await IntervalHelper.setIslandInterval(testFunction, 1000);
        await IntervalHelper.setIslandInterval(testFunction, 1000);
        const res = await IntervalHelper.getIntervalList();
        await Bluebird.delay(3000);
        expect(res.length).toBeTruthy();
    }));

    it('can get Interval Info', spec(async () => {
        await IntervalHelper.setIslandInterval(testFunction, 1000);
        const res = await IntervalHelper.getIntervalList();
        await Bluebird.delay(1000);
        expect(res.length).toBeTruthy();
    }));

    it('can purge IntervalService', spec(async () => {
        await IntervalHelper.setIslandInterval(testFunction, 1000);
        await Bluebird.delay(1000);
        await IntervalHelper.purge();
        const res = await IntervalHelper.getIntervalList();
        expect(res.length).toBe(0);
    }));
});

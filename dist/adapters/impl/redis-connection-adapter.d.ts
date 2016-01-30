import redis = require('redis');
import Promise = require('bluebird');
import AbstractAdapter from '../abstract-adapter';
export interface RedisAdapterOptions {
    port: number;
    host: string;
    clientOpts?: redis.ClientOpts;
}
/**
 * RedisConnectionAdapter
 * @class
 * @extends AbstractAdapter
 */
export default class RedisConnectionAdapter extends AbstractAdapter<redis.RedisClient, RedisAdapterOptions> {
    /**
     * Initialize the redis connection.
     * @returns {Promise<void>}
     * @override
     */
    initialize(): Promise<void>;
}

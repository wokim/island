/// <reference path="../../typings/tsd.d.ts" />
import redis = require('redis');

interface RedisAdapterOptions {
  port: number;
  host: string;
  clientOpts?: redis.ClientOpts;
}

export = RedisAdapterOptions;
/// <reference path="../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');

/**
 * MongooseAdapterType
 * @interface
 */
interface MongooseAdapterType {
  connection: mongoose.Connection;
  schemaClass: typeof mongoose.Schema;
}

export = MongooseAdapterType;
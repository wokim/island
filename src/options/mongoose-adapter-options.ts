/// <reference path="../../typings/tsd.d.ts" />
import mongoose = require('mongoose');

interface MongooseAdapterOptions {
  uri: string;
  connectionOption?: mongoose.ConnectionOption;
}

export = MongooseAdapterOptions;
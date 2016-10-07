const cls = require('continuation-local-storage');
import * as winston from 'winston';
import * as _ from 'lodash';
const config = require('winston/lib/winston/config');
const sourceMapSupport = require('source-map-support');

function getTattoo() {
  const ns = cls.getNamespace('app') || cls.createNamespace('app');
  return ns.get('RequestTrackId') || '--------';
}
const shortFormatter = (options) => {
  const tattoo = getTattoo();
  Error.stackTraceLimit = 5;
  return [
    config.colorize(options.level,`[${tattoo.slice(0, 8)}|${new Date().toTimeString().slice(0, 8)}|${options.level.slice(0, 1)}]`),
    `${options.message || ''}`,
    `${options.meta && (JSON.stringify(options.meta))}`
  ].join(' ');
}
const longFormatter = (options) => {
  const tattoo = getTattoo();
  Error.stackTraceLimit = 10;
  return [
    config.colorize(options.level, `[${tattoo.slice(0, 8)}]` + `${new Date().toISOString()}` + `${options.level}`),
    `${options.message || ''}`,
    `${options.meta && JSON.stringify(options.meta)}`
  ].join(' ');
}
const jsonFormatter = (options) => {
  const tattoo = getTattoo();
  const timestamp = Date.now();
  const log: any = {
    tattoo, timestamp,
    msg: options.message, meta: options.meta, level: options.level, category: options.label
  };
  if (process.env.ISLAND_LOGGER_TRACE) {
    const E = Error as any;
    const oldLimit = E.stackTraceLimit;
    const oldPrepare = E.prepareStackTrace;
    E.stackTraceLimit = 10;
    const myObject: any = {};
    E.prepareStackTrace = function (o, stack) {
      const caller = sourceMapSupport.wrapCallSite(stack[9]);
      log.file = caller.getFileName();
      log.line = caller.getLineNumber();
    };
    E.captureStackTrace(myObject);
    myObject.stack;
    E.stackTraceLimit = oldLimit;
    E.prepareStackTrace = oldPrepare;
  }
  return JSON.stringify(log);
}

const allTransports = [];

function createLogger(id) {
  const transports = [
    new winston.transports.Console({
      name: 'short',
      label: id,
      formatter: shortFormatter,
      silent: false
    }),
    new winston.transports.Console({
      name: 'long',
      label: id,
      formatter: longFormatter,
      silent: true
    }),
    new winston.transports.Console({
      name: 'json',
      label: id,
      formatter: jsonFormatter,
      silent: true
    })
  ];
  transports.forEach(t => allTransports.push(t));
  const logger = winston.loggers.add(id, {transports});
  logger.level = 'debug';
  logger.setLevels(winston.config.syslog.levels);
  return logger;
}

winston.addColors(winston.config.syslog.colors);

// 타입은 전체적으로 같이 이동
// 레벨은 카테고리마다 따로 이동
export namespace Loggers {
  export function switchLevel(id, level: 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'crit') {
    if (!winston.loggers.has(id)) return false;
    winston.loggers.get(id).level = level;
    return true;
  }

  export function switchType(type: 'short' | 'long' | 'json') {
    allTransports.forEach(t => {
      if (t.name !== type) {
        t.silent = true;
      } else {
        t.silent = false;
      }
    });
    return true;
  }

  export function get(id) {
    // TODO: Container로 바꾸자. 옵션 상속이 된다.
    return winston.loggers.has(id) && winston.loggers.get(id) || createLogger(id);
  }
}

/*
TODO:
Issue: https://github.com/winstonjs/winston/issues/862
Date: 08/31/2016

The fix is add below code before https://github.com/winstonjs/winston/blob/master/lib/winston/common.js#L217
  + options.meta = meta;
Need to have options.meta decycled before clone.
 */
const cycle = require('cycle');
const common = require('winston/lib/winston/common');
common.log = function (options) {
  var timestampFn = typeof options.timestamp === 'function'
      ? options.timestamp
      : common.timestamp,
    timestamp   = options.timestamp ? timestampFn() : null,
    showLevel   = options.showLevel === undefined ? true : options.showLevel,
    meta        = options.meta !== null && options.meta !== undefined && !(options.meta instanceof Error)
      ? common.clone(cycle.decycle(options.meta))
      : options.meta || null,
    output;

  //
  // raw mode is intended for outputing winston as streaming JSON to STDOUT
  //
  if (options.raw) {
    if (typeof meta !== 'object' && meta != null) {
      meta = { meta: meta };
    }
    output         = common.clone(meta) || {};
    output.level   = options.level;
    //
    // Remark (jcrugzz): This used to be output.message = options.message.stripColors.
    // I do not know why this is, it does not make sense but im handling that
    // case here as well as handling the case that does make sense which is to
    // make the `output.message = options.message`
    //
    output.message = options.message.stripColors
      ? options.message.stripColors
      : options.message;

    return JSON.stringify(output);
  }

  //
  // json mode is intended for pretty printing multi-line json to the terminal
  //
  if (options.json || true === options.logstash) {
    if (typeof meta !== 'object' && meta != null) {
      meta = { meta: meta };
    }

    output         = common.clone(meta) || {};
    output.level   = options.level;
    output.message = output.message || '';

    if (options.label) { output.label = options.label; }
    if (options.message) { output.message = options.message; }
    if (timestamp) { output.timestamp = timestamp; }

    if (typeof options.stringify === 'function') {
      return options.stringify(output);
    }

    return JSON.stringify(output, function (key, value) {
      return value instanceof Buffer
        ? value.toString('base64')
        : value;
    });
  }

  if (typeof options.formatter == 'function') {
    options.meta = meta;
    return String(options.formatter(common.clone(options)));
  }

  return output;
};

const cls = require('continuation-local-storage');
import * as winston from 'winston';
import * as _ from 'lodash';
const config = require('winston/lib/winston/config');
const sourceMapSupport = require('source-map-support');
require('./loggers-bugfix');

function getTattoo() {
  const ns = cls.getNamespace('app') || cls.createNamespace('app');
  return ns.get('RequestTrackId') || '--------';
}
const shortFormatter = (options) => {
  let meta = options.meta;
  const tattoo = getTattoo();
  if (process.env.ISLAND_LOGGER_TRACE) {
    const trace = getLogTrace();
    meta = meta || {};
    meta.file = trace.file;
    meta.line = trace.line;
  }
  return [
    config.colorize(options.level,`[${tattoo.slice(0, 8)}|${new Date().toTimeString().slice(0, 8)}|${options.level.slice(0, 1)}]`),
    `${options.message || ''}`,
    `${options.meta && (JSON.stringify(options.meta))}`
  ].join(' ');
}
const longFormatter = (options) => {
  let meta = options.meta;
  const tattoo = getTattoo();
  if (process.env.ISLAND_LOGGER_TRACE) {
    const trace = getLogTrace();
    meta = meta || {};
    meta.file = trace.file;
    meta.line = trace.line;
  }
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
    const { file, line } = getLogTrace();
    log.file = file;
    log.line = line;
  }
  return JSON.stringify(log);
}

function getLogTrace() {
    const E = Error as any;
    const oldLimit = E.stackTraceLimit;
    const oldPrepare = E.prepareStackTrace;
    E.stackTraceLimit = 11;
    const returnObject: any = {};
    E.prepareStackTrace = function (o, stack) {
      const caller = sourceMapSupport.wrapCallSite(stack[10]);
      returnObject.file = caller.getFileName();
      returnObject.line = caller.getLineNumber();
    };
    E.captureStackTrace(returnObject);
    returnObject.stack;
    E.stackTraceLimit = oldLimit;
    E.prepareStackTrace = oldPrepare;
    return returnObject;
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

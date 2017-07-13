import * as error from '../utils/error';
import {
  AbstractError,
  AbstractEtcError,
  AbstractExpectedError,
  AbstractFatalError,
  AbstractLogicError,
  ErrorLevel,
  getIslandCode,
  IslandLevel
} from '../utils/error';
import { logger } from '../utils/logger';
import reviver from '../utils/reviver';

export interface IRpcResponse {
  version: number;
  result: boolean;
  body?: AbstractError | any;
}

function replacer(k, v: error.AbstractError | Error | number | boolean) {
  if (v instanceof AbstractError) {
    return {
      message: v.message,
      name: v.name,

      code: v.code,
      reason: v.reason,

      statusCode: v.statusCode,
      stack: v.stack,
      extra: v.extra
    };
  } else if (v instanceof Error) {
    const e = new AbstractEtcError(getIslandCode(), IslandLevel.UNKNOWN, 0, v.message);
    e.extra = (v as any).extra || e.extra;
    return {
      message: e.message,
      name: v.name,

      code: e.code,
      reason: e.reason,

      stack: e.stack,
      extra: e.extra
    };
  }
  return v;
}

export class RpcResponse {
  static reviver: ((k, v) => any) | undefined = reviver;
  static encode(body: any): Buffer {
    const res: IRpcResponse = {
      body,
      result: body instanceof Error ? false : true,
      version: 1
    };

    return new Buffer(JSON.stringify(res, replacer), 'utf8');
  }

  static decode(msg: Buffer): IRpcResponse {
    try {
      const res: IRpcResponse = JSON.parse(msg.toString('utf8'), RpcResponse.reviver);
      if (!res.result) res.body = this.getAbstractError(res.body);

      return res;
    } catch (e) {
      logger.notice('[decode error]', e);
      return { version: 0, result: false };
    }
  }

  static getAbstractError(err: AbstractError): AbstractError {
    let result: AbstractError;
    const { errorLevel, islandCode, islandLevel, errorCode } = AbstractError.splitCode(err.code);
    switch (errorLevel) {
      case ErrorLevel.EXPECTED:
        result = new AbstractExpectedError(islandCode, islandLevel, errorCode, err.reason);
        break;
      case ErrorLevel.LOGIC:
        result = new AbstractLogicError(islandCode, islandLevel, errorCode, err.reason);
        break;
      case ErrorLevel.FATAL:
        result = new AbstractFatalError(islandCode, islandLevel, errorCode, err.reason);
        break;
      default:
        result = new AbstractEtcError(islandCode, islandLevel, 1, err.reason);
        result.name = err.name;
    }

    result.statusCode = err.statusCode;
    result.stack = err.stack;
    result.extra = err.extra;

    return result;
  }
}

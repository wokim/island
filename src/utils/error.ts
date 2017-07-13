import * as assert from 'assert';
import * as _ from 'lodash';
import * as uuid from 'uuid';

export type ErrorLevelName = 'EXPECTED' | 'LOGIC' | 'FATAL' | 'ETC';
export enum ErrorLevel {
  EXPECTED  = 1,
  LOGIC     = 2,
  FATAL     = 3,
  RESERVED4 = 4,
  RESERVED5 = 5,
  RESERVED6 = 6,
  RESERVED7 = 7,
  RESERVED8 = 8,
  ETC       = 9
}

export enum IslandLevel {
  ISLAND    = 0,
  ISLANDJS  = 1,
  UNKNOWN   = 2,
  RESERVED3 = 3,
  RESERVED4 = 4,
  RESERVED5 = 5,
  RESERVED6 = 6,
  RESERVED7 = 7,
  RESERVED8 = 8,
  RESERVED9 = 9
}

let islandCode = 0;

export function setIslandCode(code: number) {
  assert(0 <= code);
  assert(code < 1000);
  islandCode = code;
}

export function getIslandCode() {
  return islandCode;
}

/*
  1 0 0 1 0 0 0 0 1
  _ _____ _ _______
  | |     | \_ errorCode
  | |     \_ islandLevel
  | \_ islandCode
  \_ errorLevel
*/
export class AbstractError extends Error {
  static splitCode(code) {
    const errorLevel = Math.floor(code / 100000000);
    const islandCode = Math.floor(code / 100000) % 1000;
    const islandLevel = Math.floor(code / 10000) % 10 as IslandLevel;
    const errorCode = code % 10000;
    return {
      errorLevel,
      errorLevelName: ErrorLevel[errorLevel],
      islandCode,
      islandLevel,
      islandLevelName: IslandLevel[islandLevel],
      errorCode
    };
  }

  static mergeCode(errorLevel: ErrorLevel, islandCode: number, islandLevel: IslandLevel, errorCode: number) {
    return errorLevel * 100000000 +
           islandCode * 100000 +
           islandLevel * 10000 +
           errorCode;
  }

  static ensureUuid(extra: {[key: string]: any; uuid: string}) {
    if (extra.uuid) return extra;
    return _.merge({}, extra, {uuid: uuid.v4()});
  }

  public code: number;
  public reason: string;

  public statusCode: number;
  public stack: any;
  public extra: any;

  constructor(errorLevelName: ErrorLevelName,
              islandCode: number,
              islandLevel: IslandLevel,
              errorCode: number,
              reason: string) {
    super(`${islandCode}/${islandLevel}/${errorCode}/${reason}`);
    this.code = AbstractError.mergeCode(ErrorLevel[errorLevelName], islandCode, islandLevel, errorCode);
    this.reason = reason;
    this.extra = { uuid: uuid.v4() };
  }

  split() {
    return AbstractError.splitCode(this.code);
  }
}

export class AbstractExpectedError extends AbstractError {
  constructor(islandCode: number,
              islandLevel: IslandLevel,
              errorCode: number,
              reason: string) {
    super('EXPECTED', islandCode, islandLevel, errorCode, reason);
    this.name = 'ExpectedError';
  }
}

export class AbstractLogicError extends AbstractError {
constructor(islandCode: number,
            islandLevel: IslandLevel,
            errorCode: number,
            reason: string) {
    super('LOGIC', islandCode, islandLevel, errorCode, reason);
    this.name = 'LogicError';
  }
}

export class AbstractFatalError extends AbstractError {
  constructor(islandCode: number,
              islandLevel: IslandLevel,
              errorCode: number,
              reason: string) {
    super('FATAL', islandCode, islandLevel, errorCode, reason);
    this.name = 'FatalError';
  }
}

export class AbstractEtcError extends AbstractError {
  constructor(islandCode: number,
              islandLevel: IslandLevel,
              errorCode: number,
              reason: string) {
    super('ETC', islandCode, islandLevel, errorCode, reason);
    this.name = 'EtcError';
  }
}

export class LogicError extends AbstractLogicError {
  constructor(errorCode: ISLAND.LOGIC, reason?: string) {
    super(islandCode, IslandLevel.ISLANDJS, errorCode, reason || '');
  }
}

export class FatalError extends AbstractFatalError {
  constructor(errorCode: ISLAND.FATAL, reason?: string) {
    super(islandCode, IslandLevel.ISLANDJS, errorCode, reason || '');
  }
}

export class ExpectedError extends AbstractExpectedError {
  constructor(errorCode: ISLAND.EXPECTED, reason?: string) {
    super(islandCode, IslandLevel.ISLANDJS, errorCode, reason || '');
  }
}

export namespace ISLAND {
  export enum EXPECTED {
    E0001_UNKNOWN = 1
  }

  export enum LOGIC {
    L0001_PLAYER_NOT_EXIST = 1,
    L0002_WRONG_PARAMETER_SCHEMA = 2,
    L0003_NOT_INITIALIZED_EXCEPTION = 3,
    L0004_MSG_PACK_ERROR = 4,
    L0005_MSG_PACK_ENCODE_ERROR = 5,
    L0006_HANDLE_MESSAGE_ERROR = 6,
    L0007_PUSH_ENCODE_ERROR = 7
  }

  export enum FATAL {
    F0001_ISLET_ALREADY_HAS_BEEN_REGISTERED   = 1,
    F0002_DUPLICATED_ADAPTER                  = 2,
    F0003_MISSING_ADAPTER                     = 3,
    F0004_NOT_IMPLEMENTED_ERROR               = 4,
    F0008_AMQP_CHANNEL_POOL_REQUIRED          = 8,
    F0011_NOT_INITIALIZED_EXCEPTION           = 11,
    F0012_ROUND_ROBIN_EVENT_Q_IS_NOT_DEFINED  = 12,
    F0013_NOT_INITIALIZED                     = 13,
    F0015_TAG_IS_UNDEFINED                    = 15,
    F0016_SCOPE_CONTEXT_ERROR                 = 16,
    F0018_ERROR_COLLECTING_META_DATA          = 18,
    F0019_NOT_IMPLEMENTED_ERROR               = 19,
    F0020_NOT_INITIALIZED_EXCEPTION           = 20,
    F0021_NOT_IMPLEMENTED_ERROR               = 21,
    F0022_NOT_INITIALIZED_EXCEPTION           = 22,
    F0023_RPC_TIMEOUT                         = 23,
    F0024_ENDPOINT_METHOD_REDECLARED          = 24,
    F0025_MISSING_ADAPTER_OPTIONS             = 25,
    F0026_MISSING_REPLYTO_IN_RPC              = 26,
    F0027_CONSUMER_IS_CANCELED                = 27
  }
}

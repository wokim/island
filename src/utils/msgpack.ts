import * as msgpack5 from 'msgpack5';
import bl = require('bl');
import { logger } from '../utils/logger';
import { LogicError, FatalError, ISLAND } from '../utils/error';

export default class MessagePack {
  private static instance: MessagePack;
  private packer = msgpack5();

  constructor() {
    if (MessagePack.instance) {
      throw new FatalError(ISLAND.FATAL.F0022_NOT_INITIALIZED_EXCEPTION, 'Error: Instantiation failed: Use getInst() instead of new.');
    }
    MessagePack.instance = this;

    // NOTE: timestamp를 직접 buffer에 쓰면 더 압축할 수 있다.
    this.packer.register(0x01, Date,
      (date: Date) => {
        return new Buffer(date.toISOString());
      }, (buf: Buffer) => {
        return new Date(buf.toString());
      });
    this.packer.register(0x03, Error,
      (error: Error & {stack: string, statusCode: number, extra?}) => {
        return new Buffer(JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack,
          statusCode: error.statusCode,
          extra: error.extra
        }));
      }, (buf: Buffer) => {
        let errorObject = JSON.parse(buf.toString());
        let err: any = new LogicError(ISLAND.LOGIC.L0004_MSG_PACK_ERROR, errorObject.message);
        err.name = errorObject.name;
        err.stack = errorObject.stack;
        err.statusCode = errorObject.statusCode;
        err.extra = errorObject.extra;
        return err;
      }
    );
  }

  public static getInst(): MessagePack {
    if (!MessagePack.instance) {
      MessagePack.instance = new MessagePack();
    }
    return MessagePack.instance;
  }

  public encode(obj: any): Buffer {
    try {
      // msgpack.encode는 BufferList를 반환하지만, Buffer와 읽기 호환 인터페이스를 제공한다.
      // https://www.npmjs.com/package/bl
      // @kson //2016-08-23
      return this.packer.encode(obj) as any as Buffer;
    } catch (e) {
      logger.debug('[MSG ENCODE ERROR]',e);
      let error:any = new LogicError(ISLAND.LOGIC.L0005_MSG_PACK_ENCODE_ERROR, e.message);
      logger.debug(error.stack);
      throw e;
    }
  }

  public decode<T>(buf: Buffer): T;
  public decode<T>(buf: bl): T;
  public decode<T>(buf: any): T {
    return this.packer.decode<T>(buf);
  }
}
import * as msgpack5 from 'msgpack5';
import * as mongoose from 'mongoose';
import bl = require('bl');
import * as _debug from 'debug';

let debug = _debug('ISLAND:UTILS:MSGPACK');

export default class MessagePack {
  private static instance: MessagePack;
  private packer = msgpack5();

  constructor() {
    if (MessagePack.instance) {
      throw new Error('Error: Instantiation failed: Use getInst() instead of new.');
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
        // TODO: edge.Error를 정의하기 전 까지 임시로 사용
        let errorObject = JSON.parse(buf.toString());
        let err: any = new Error(errorObject.message);
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

  public encode(obj: any): any {
    try {
      return this.packer.encode(obj);
    } catch (e) {
      debug('[MSG ENCODE ERROR]',e);
      let error:any = new Error();
      debug(error.stack);
      throw e;
    }

  }

  public decode<T>(buf: Buffer): T;
  public decode<T>(buf: bl): T;
  public decode<T>(buf: any): T {
    return this.packer.decode<T>(buf);
  }
}
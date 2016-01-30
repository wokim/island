// Type definitions for msgpack5 v1.3.2
// Project: https://github.com/mcollina/msgpack5/
// Definitions by: Wonshik Kim <https://github.com/wokim/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../node/node.d.ts" />
/// <reference path="../bl/bl.d.ts" />

declare module "msgpack5" {
  import stream = require('stream');
  import bl = require('bl');
  
  interface Options {
    header?: boolean;
    msgpack?: any;
  }

  class Base extends stream.Transform {
    protected _header;
    protected _msgpack;
  }  

  class Encoder extends Base {
    constructor(opts?: Options);
    public _transform(obj: any, enc: any, done: Function);
  }

  class Decoder extends Base {
    constructor(opts?: Options);
    public _chunks: bl;
    public _length: number;
    public _transform(buf: any, enc: any, done: Function);
  }

  interface MessagePack {
    (): {
      encode(obj: any): bl;
      decode<T>(buf: Buffer): T;
      decode<T>(buf: bl): T;
      register(type: number, $constructor: any, encode: (obj: any) => Buffer, decode: (data: Buffer) => any);
      registerEncoder(check: (obj: any) => boolean, encode: (obj: any) => Buffer);
      registerDecoder(type: number, decode: (data: Buffer) => any);
      encoder(opts?: Options): Encoder;
      decoder(opts?: Options): Decoder;
    };
  }

  var msgpack: MessagePack;
  export = msgpack;
}
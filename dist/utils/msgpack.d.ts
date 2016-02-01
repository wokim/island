import bl = require('bl');
export default class MessagePack {
    private static instance;
    private packer;
    constructor();
    static getInst(): MessagePack;
    encode(obj: any): any;
    decode<T>(buf: Buffer): T;
    decode<T>(buf: bl): T;
}

import * as Promise from 'bluebird';
export interface Endpoint {
    options?: EndpointOptions;
    handler?: (req) => Promise<any>;
}
export declare type Endpoints = {
    [name: string]: Endpoint;
};
export interface EndpointOptions {
    scope?: {
        resource: number;
        authority: number;
    };
    version?: string;
    ignoreAllMiddleware?: boolean;
    schema?: any;
    developmentOnly?: boolean;
}
export declare function endpoint(name: string, options?: EndpointOptions): (target: any, key: any, desc: any) => void;
export declare function endpointController(registerer?: {
    registerEndpoint: (name: string, value: any) => Promise<any>;
}): (target: any) => void;
export declare function rpc(target: any, key: any, desc: any): void;
export declare function rpcController(target: any): void;

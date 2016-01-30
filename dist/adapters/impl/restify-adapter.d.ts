import * as restify from 'restify';
import * as Promise from 'bluebird';
import ListenableAdapter from '../listenable-adapter';
/** @deprecated ***********************************/
import { IToken } from './middlewares/restify-jwt-middleware';
import { ISession, ISessionStore } from './middlewares/restify-session-middleware';
export interface Request extends restify.Request {
    token?: IToken;
    session?: ISession;
}
export interface Response extends restify.Response {
}
export interface RestifyAdapterOptions {
    serverOptions?: restify.ServerOptions;
    middlewares?: restify.RequestHandler[];
    store: ISessionStore;
    port: number;
    secret: string;
}
/**
 * RestifyAdapter
 * @class
 * @extends ListenableAdapter
 */
export default class RestifyAdapter extends ListenableAdapter<restify.Server, RestifyAdapterOptions> {
    /**
     * Initialize the restify server.
     * @override
     * @returns {Promise<void>}
     */
    initialize(): Promise<void>;
    /**
     * Listen the restify server.
     * @override
     * @returns {Promise<void>}
     */
    listen(): Promise<void>;
}

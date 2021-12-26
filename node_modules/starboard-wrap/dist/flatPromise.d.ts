export interface FlatPromise<T = any, E = any> {
    resolve: (value?: T) => void;
    reject: (reason?: E) => void;
    promise: Promise<T>;
}
/**
 * Creates a promise with the resolve and reject function outside of it, useful for tasks that may complete at any time.
 * Based on MIT licensed https://github.com/arikw/flat-promise, with typings added by gzuidhof.
 * @param executor
 */
export declare function flatPromise<T = any, E = any>(executor?: (resolve: (value?: T) => void, reject: (reason?: E) => void) => void | Promise<void>): FlatPromise<T, E>;

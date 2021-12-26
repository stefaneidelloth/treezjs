/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/**
 * Creates a promise with the resolve and reject function outside of it, useful for tasks that may complete at any time.
 * Based on MIT licensed https://github.com/arikw/flat-promise, with typings added by gzuidhof.
 * @param executor
 */
export function flatPromise(executor) {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        // Is this any cast necessary?
        resolve = res;
        reject = rej;
    });
    if (executor) {
        // This is actually valid.. as in the spec the function above the Promise gets executed immediately.
        executor(resolve, reject);
    }
    return { promise, resolve, reject };
}
//# sourceMappingURL=flatPromise.js.map
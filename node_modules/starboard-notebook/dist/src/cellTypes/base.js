/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
export class BaseCellHandler {
    constructor(cell, runtime) {
        this.cell = cell;
        this.runtime = runtime;
    }
    run() {
        return Promise.resolve();
    }
    dispose() {
        return Promise.resolve();
    }
    focusEditor(_opts) {
        return;
    }
    clear() {
        return;
    }
}
//# sourceMappingURL=base.js.map
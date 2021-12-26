/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Hook from "console-feed-modern/lib/Hook/index";
import methods from "console-feed-modern/lib/definitions/Methods";
export class ConsoleCatcher {
    constructor(console) {
        this.originalMethods = {};
        methods.forEach((m) => (this.originalMethods[m] = console[m]));
        Hook(console, (msg) => {
            if (this.currentHook) {
                this.currentHook(msg);
            }
        }, false);
    }
    hook(callback) {
        this.currentHook = callback;
    }
    unhook(callback) {
        if (this.currentHook === callback) {
            this.currentHook = undefined;
        }
    }
    /**
     * Can be used to circumvent the console catcher.
     */
    getRawConsoleMethods() {
        return this.originalMethods;
    }
}
//# sourceMappingURL=console.js.map
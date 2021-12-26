/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
let ConsoleOutputElement = class ConsoleOutputElement extends LitElement {
    constructor() {
        super();
        this.updatePending = false;
        this.logs = [];
        this.logHook = (msg) => {
            this.addEntry(msg);
        };
    }
    createRenderRoot() {
        return this;
    }
    hook(consoleCatcher) {
        consoleCatcher.hook(this.logHook);
    }
    unhook(consoleCatcher) {
        consoleCatcher.unhook(this.logHook);
    }
    async unhookAfterOneTick(consoleCatcher) {
        return new Promise((resolve) => window.setTimeout(() => {
            this.unhook(consoleCatcher);
            resolve(undefined);
        }, 0));
    }
    addEntry(msg) {
        this.logs.push(msg);
        if (!this.updatePending) {
            this.updatePending = true;
            requestAnimationFrame(() => this.requestUpdate());
        }
    }
    render() {
        // We load the console output functionality asynchronously
        const comPromise = import(/* webpackChunkName: "console-output", webpackPrefetch: true */ "./consoleOutputModule");
        const rootEl = document.createElement("div");
        rootEl.classList.add("starboard-console-output-inner");
        comPromise.then((c) => {
            c.renderStandardConsoleOutputIntoElement(rootEl, this.logs);
            this.updatePending = false;
        });
        return html `${rootEl}`;
    }
};
__decorate([
    property({ attribute: false })
], ConsoleOutputElement.prototype, "logs", void 0);
ConsoleOutputElement = __decorate([
    customElement("starboard-console-output")
], ConsoleOutputElement);
export { ConsoleOutputElement };
//# sourceMappingURL=consoleOutput.js.map
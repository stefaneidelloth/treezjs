/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { html, render } from "lit";
import { BaseCellHandler } from "../base";
import { cellControlsTemplate } from "../../components/controls";
import { JavascriptEvaluator } from "./eval";
import { ConsoleOutputElement } from "../../components/output/consoleOutput";
import { StarboardTextEditor } from "../../components/textEditor";
import { renderIfHtmlOutput } from "../../components/output/htmlOutput";
export const JAVASCRIPT_CELL_TYPE_DEFINITION = {
    name: "Javascript",
    cellType: ["javascript", "js"],
    createHandler: (c, r) => new JavascriptCellHandler(c, r),
};
export class JavascriptCellHandler extends BaseCellHandler {
    constructor(cell, runtime) {
        super(cell, runtime);
        this.isCurrentlyRunning = false;
        this.lastRunId = 0;
        this.jsRunner = new JavascriptEvaluator();
    }
    getControls() {
        const icon = this.isCurrentlyRunning ? "bi bi-hourglass" : "bi bi-play-circle";
        const tooltip = this.isCurrentlyRunning ? "Cell is running" : "Run Cell";
        const runButton = {
            icon,
            tooltip,
            callback: (_evt) => this.runtime.controls.runCell({ id: this.cell.id }),
        };
        return cellControlsTemplate({ buttons: [runButton] });
    }
    attach(params) {
        this.elements = params.elements;
        const topElement = this.elements.topElement;
        topElement.classList.add("flush");
        render(this.getControls(), this.elements.topControlsElement);
        this.editor = new StarboardTextEditor(this.cell, this.runtime, {
            language: "javascript",
        });
        topElement.appendChild(this.editor);
    }
    async run() {
        this.lastRunId++;
        const currentRunId = this.lastRunId;
        this.isCurrentlyRunning = true;
        render(this.getControls(), this.elements.topControlsElement);
        this.outputElement = new ConsoleOutputElement();
        this.outputElement.hook(this.runtime.consoleCatcher);
        const htmlOutput = document.createElement("div");
        htmlOutput.classList.add("cell-output-html");
        render(html `${this.outputElement}${htmlOutput}`, this.elements.bottomElement);
        const outVal = await this.jsRunner.run(this.cell.textContent);
        // Not entirely sure this is necessary anymore, but we had to wait one tick with unhooking
        // as some console messages are delayed by one tick it seems.
        await this.outputElement.unhookAfterOneTick(this.runtime.consoleCatcher);
        const val = outVal.value;
        const htmlOutputRendered = renderIfHtmlOutput(val, htmlOutput);
        if (!htmlOutputRendered && val !== undefined) {
            // Don't show undefined output
            if (outVal.error) {
                if (val.stack !== undefined) {
                    let stackToPrint = val.stack;
                    const errMsg = val.toString();
                    if (stackToPrint.startsWith(errMsg)) {
                        // Prevent duplicate error msg in Chrome
                        stackToPrint = stackToPrint.substr(errMsg.length);
                    }
                    this.outputElement.addEntry({
                        method: "error",
                        data: [errMsg, stackToPrint],
                    });
                }
                else {
                    this.outputElement.addEntry({
                        method: "error",
                        data: [val],
                    });
                }
            }
            else {
                this.outputElement.addEntry({
                    method: "result",
                    data: [val],
                });
            }
        }
        if (this.lastRunId === currentRunId) {
            this.isCurrentlyRunning = false;
            render(this.getControls(), this.elements.topControlsElement);
        }
        if (outVal.error) {
            throw val;
        }
    }
    focusEditor(opts) {
        var _a;
        this.editor.focus();
        this.editor.setCaretPosition((_a = opts.position) !== null && _a !== void 0 ? _a : "start");
    }
    async dispose() {
        this.editor.remove();
    }
    clear() {
        render(html ``, this.elements.bottomElement);
    }
}
//# sourceMappingURL=javascript.js.map
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { render } from "lit";
import { BaseCellHandler } from "./base";
import { cellControlsTemplate } from "../components/controls";
import { StarboardTextEditor } from "../components/textEditor";
import { katexLoader } from "../components/helpers/katex";
export const LATEX_CELL_TYPE_DEFINITION = {
    name: "LateX (KaTeX)",
    cellType: ["latex"],
    createHandler: (c, r) => new LatexCellHandler(c, r),
};
export class LatexCellHandler extends BaseCellHandler {
    constructor(cell, runtime) {
        super(cell, runtime);
        this.isInEditMode = true;
    }
    getControls() {
        let editOrRunButton;
        if (this.isInEditMode) {
            editOrRunButton = {
                icon: "bi bi-play-circle",
                tooltip: "Render LaTeX",
                callback: (_evt) => this.runtime.controls.runCell({ id: this.cell.id }),
            };
        }
        else {
            editOrRunButton = {
                icon: "bi bi-pencil-square",
                tooltip: "Edit LaTeX",
                callback: () => this.enterEditMode(),
            };
        }
        return cellControlsTemplate({ buttons: [editOrRunButton] });
    }
    attach(params) {
        this.elements = params.elements;
        if (this.cell.textContent !== "") {
            this.run();
        }
        else {
            // When creating an empty cell, it makes more sense to start in editor mode
            this.enterEditMode();
        }
    }
    setupEditor() {
        const topElement = this.elements.topElement;
        topElement.innerHTML = "";
        this.editor = new StarboardTextEditor(this.cell, this.runtime, {
            language: "latex",
            wordWrap: "on",
        });
        topElement.appendChild(this.editor);
    }
    enterEditMode() {
        this.isInEditMode = true;
        this.setupEditor();
        render(this.getControls(), this.elements.topControlsElement);
    }
    async run() {
        const topElement = this.elements.topElement;
        if (this.editor !== undefined) {
            this.editor.dispose();
            delete this.editor;
        }
        (await katexLoader()).render(this.cell.textContent, topElement, {
            throwOnError: false,
            errorColor: "#cc0000",
            displayMode: true,
        });
        topElement.children[0].addEventListener("dblclick", (_event) => this.enterEditMode());
        this.isInEditMode = false;
        render(this.getControls(), this.elements.topControlsElement);
    }
    async dispose() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
    focusEditor(opts) {
        var _a;
        if (this.editor) {
            this.editor.focus();
            this.editor.setCaretPosition((_a = opts.position) !== null && _a !== void 0 ? _a : "start");
        }
    }
    clear() {
        // Do nothing
    }
}
//# sourceMappingURL=latex.js.map
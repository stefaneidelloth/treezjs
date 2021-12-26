/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { BaseCellHandler } from "./base";
import { html, render } from "lit";
import { StarboardTextEditor } from "../components/textEditor";
export const DEFAULT_CELL_TYPE_DEFINITION = {
    name: "Unknown",
    cellType: "",
    createHandler: (c, r) => new DefaultCellHandler(c, r),
};
/**
 * The cell handler that gets used when there is an unknown cell type
 */
export class DefaultCellHandler extends BaseCellHandler {
    constructor(cell, runtime) {
        super(cell, runtime);
        this.editor = new StarboardTextEditor(this.cell, this.runtime);
    }
    attach(params) {
        render(html `${this.editor}`, params.elements.topElement);
    }
    focusEditor(opts) {
        var _a;
        if (this.editor) {
            this.editor.focus();
            this.editor.setCaretPosition((_a = opts.position) !== null && _a !== void 0 ? _a : "start");
        }
    }
}
//# sourceMappingURL=default.js.map
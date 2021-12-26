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
import { customElement, query } from "lit/decorators.js";
import { createPopper } from "@popperjs/core";
import { CellTypePicker } from "./cellTypePicker";
import { CellElement } from "./cell";
// Lazily initialized.. but cached for re-use.
let globalCellTypePicker;
let InsertionLine = class InsertionLine extends LitElement {
    constructor() {
        super();
        this.insertPosition = "after";
        // TODO: pass this in..
        this.runtime = window.runtime;
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        this.requestUpdate();
    }
    firstUpdated() {
        this.insertPosition = this.classList.contains("insertion-line-top") ? "before" : "after";
        if (!globalCellTypePicker) {
            // TODO: Flow runtime into this some nicer way.
            globalCellTypePicker = new CellTypePicker(window.runtime);
        }
        this.classList.add("line-grid");
        let unpop;
        let lastActive;
        let popoverIsActive = false;
        // TODO: refactor into separate function (and maybe find a way to detect "out of bounds" click in a nicer way)
        if (this.buttonElement !== undefined) {
            const btn = this.buttonElement;
            this.buttonElement.addEventListener("click", (_) => {
                if (popoverIsActive)
                    return;
                this.appendChild(globalCellTypePicker);
                lastActive = Date.now();
                const listener = (evt) => {
                    const isClickInside = globalCellTypePicker.contains(evt.target);
                    if (!isClickInside) {
                        unpop();
                    }
                };
                unpop = () => {
                    // Clean up the overlay
                    if (Date.now() - lastActive < 100) {
                        return;
                    }
                    popoverIsActive = false;
                    pop.destroy();
                    globalCellTypePicker.remove();
                    document.removeEventListener("click", listener);
                };
                document.addEventListener("click", listener);
                const pop = createPopper(btn, globalCellTypePicker, {
                    placement: "right-start",
                    strategy: "fixed",
                });
                const parent = this.parentElement;
                if (parent && parent instanceof CellElement) {
                    globalCellTypePicker.setHighlightedCellType(parent.cell.cellType);
                }
                globalCellTypePicker.onInsert = (cellData) => {
                    // Right now we assume the insertion line has a cell as parent
                    if (parent && parent instanceof CellElement) {
                        this.runtime.controls.insertCell({
                            adjacentCellId: parent.cell.id,
                            position: this.insertPosition,
                            data: cellData,
                        });
                        unpop();
                    }
                };
                popoverIsActive = true;
            });
        }
    }
    quickInsert(cellType) {
        const parent = this.parentElement;
        if (parent && parent instanceof CellElement) {
            this.runtime.controls.insertCell({
                adjacentCellId: parent.cell.id,
                position: this.insertPosition,
                data: { cellType },
            });
        }
    }
    render() {
        const parent = this.parentElement;
        let cellType = "markdown";
        if (parent && parent instanceof CellElement) {
            cellType = parent.cell.cellType;
        }
        return html `
      <div class="hover-area" contenteditable="off">
        <div class="button-container">
          <button class="btn insert-button plus" title="Insert Cell"><span class="bi bi-plus"></span></button>
        </div>
        <div class="button-container ms-2 pe-3">
          <button class="btn insert-button" @click=${() => this.quickInsert(cellType)} title="Insert ${cellType} Cell">
            <span>+&nbsp;${cellType}</span>
          </button>
        </div>
        <div class="content-line"></div>
      </div>
    `;
    }
};
__decorate([
    query(".insert-button.plus")
], InsertionLine.prototype, "buttonElement", void 0);
__decorate([
    query(".hover-area")
], InsertionLine.prototype, "hoverArea", void 0);
InsertionLine = __decorate([
    customElement("starboard-insertion-line")
], InsertionLine);
export { InsertionLine };
//# sourceMappingURL=insertionLine.js.map
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { createElement } from "react";
import { render } from "react-dom";
import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import RichMarkdownEditor, { theme } from "./rich-editor";
import Math from "./rich-editor/nodes/Math";
import MathDisplay from "./rich-editor/nodes/MathDisplay";
let StarboardRichEditorElement = class StarboardRichEditorElement extends LitElement {
    constructor(content, runtime, opts = {}) {
        super();
        this.content = content;
        this.runtime = runtime;
        this.opts = opts;
        this.editorVNode = this.setupEditor();
        this.editor = render(this.editorVNode, this);
    }
    connectedCallback() {
        super.connectedCallback();
        // We don't run the cell if the editor has focus, as shift+enter has special meaning.
        this.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && this.editor.view.hasFocus()) {
                if (event.ctrlKey || event.shiftKey) {
                    event.stopPropagation();
                    return true;
                }
            }
        });
    }
    createRenderRoot() {
        return this;
    }
    setupEditor() {
        const editorTheme = { ...theme };
        editorTheme.fontFamily = "var(--font-sans)";
        editorTheme.fontFamilyMono = "var(--font-mono)";
        const math = new Math();
        const mathDisplay = new MathDisplay();
        return createElement(RichMarkdownEditor, {
            defaultValue: this.content.textContent,
            placeholder: "Start writing here..",
            extensions: [math, mathDisplay],
            theme: editorTheme,
            onChange: (v) => {
                this.content.textContent = v();
            },
            readOnly: this.content.editable === false,
            onClickLink: (href, event) => {
                window.open(href, "_blank");
            },
            embeds: [],
            tooltip: undefined,
        });
    }
    refreshSettings() {
        // Dummy transaction
        this.editor.view.dispatch(this.editor.view.state.tr);
    }
    getContentAsMarkdownString() {
        return this.editor.value();
    }
    focus() {
        this.editor.focusAtStart();
    }
    setCaretPosition(position) {
        if (position === "start") {
            this.editor.focusAtStart();
        }
        else {
            this.editor.focusAtEnd();
        }
    }
    dispose() {
        // No cleanup yet..
    }
};
StarboardRichEditorElement = __decorate([
    customElement("starboard-rich-editor")
], StarboardRichEditorElement);
export { StarboardRichEditorElement };
//# sourceMappingURL=element.js.map
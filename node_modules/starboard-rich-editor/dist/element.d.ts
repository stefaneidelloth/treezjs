import React from "react";
import { LitElement } from "lit";
import RichMarkdownEditor, { Props } from "./rich-editor";
import { ContentContainer } from "./types";
import { EditorState } from "prosemirror-state";
export declare class StarboardRichEditorElement extends LitElement {
    content: ContentContainer;
    runtime: any;
    opts: {
        editable?: ((state: EditorState) => boolean) | undefined;
    };
    editor: RichMarkdownEditor;
    editorVNode: React.CElement<Props, RichMarkdownEditor>;
    constructor(content: ContentContainer, runtime: any, opts?: {
        editable?: (state: EditorState) => boolean;
    });
    connectedCallback(): void;
    createRenderRoot(): this;
    private setupEditor;
    refreshSettings(): void;
    getContentAsMarkdownString(): string;
    focus(): void;
    setCaretPosition(position: "start" | "end"): void;
    dispose(): void;
}

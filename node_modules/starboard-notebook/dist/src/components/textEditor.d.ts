/**
 * NOTE: TODO:
 * This file needs a complete refactor..
 */
import { LitElement } from "lit";
import { Cell, Runtime } from "../types";
export declare type SupportedLanguage = "javascript" | "typescript" | "markdown" | "css" | "html" | "python" | "latex";
export declare type WordWrapSetting = "off" | "on";
/**
 * StarboardTextEditor abstracts over different text editors that are loaded dynamically.
 * The user can choose: monaco for desktop devices, or a more minimal editor for mobile phones.
 *
 * TODO: this file needs a big cleanup..
 */
export declare class StarboardTextEditor extends LitElement {
    private editorMountpoint;
    private cell;
    private runtime;
    private opts;
    editorInstance?: any;
    constructor(cell: Cell, runtime: Runtime, opts?: {
        language?: SupportedLanguage;
        wordWrap?: WordWrapSetting;
    });
    createRenderRoot(): this;
    connectedCallback(): void;
    handleDblClick(): void;
    firstUpdated(changedProperties: any): void;
    initEditor(): Promise<void>;
    switchToCodeMirrorEditor(): void;
    switchToMonacoEditor(): void;
    copyCellText(): void;
    render(): import("lit").TemplateResult<1>;
    focus(): void;
    setCaretPosition(position: "start" | "end"): void;
    dispose(): void;
}

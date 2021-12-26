import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { WordWrapSetting } from "../textEditor";
import { Cell, Runtime } from "../../types";
export declare type MonacoEditorSupportedLanguage = "javascript" | "typescript" | "markdown" | "css" | "html" | "python";
export declare function createMonacoEditor(element: HTMLElement, cell: Cell, opts: {
    language?: MonacoEditorSupportedLanguage;
    wordWrap?: WordWrapSetting;
}, runtime: Runtime): monaco.editor.IStandaloneCodeEditor;

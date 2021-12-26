import { EditorView } from "@codemirror/view";
import type { Cell, Runtime } from "../../../types";
export declare function createCodeMirrorEditor(element: HTMLElement, cell: Cell, opts: {
    language?: string;
    wordWrap?: "off" | "on" | "wordWrapColumn" | "bounded";
}, runtime: Runtime): EditorView;

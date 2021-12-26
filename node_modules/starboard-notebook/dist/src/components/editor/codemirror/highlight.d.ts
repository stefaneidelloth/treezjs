import { EditorView } from "@codemirror/view";
export declare function createCodeMirrorCodeHighlight(content: string, opts: {
    language?: string;
}): Promise<EditorView>;

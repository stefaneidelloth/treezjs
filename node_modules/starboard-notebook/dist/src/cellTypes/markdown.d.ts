import { BaseCellHandler } from "./base";
import { Cell } from "../types";
import { CellHandlerAttachParameters, Runtime } from "../types";
declare type EditMode = "wysiwyg" | "code" | "display";
export declare const MARKDOWN_CELL_TYPE_DEFINITION: {
    name: string;
    cellType: string[];
    createHandler: (c: Cell, r: Runtime) => MarkdownCellHandler;
};
export declare class MarkdownCellHandler extends BaseCellHandler {
    private editMode;
    private elements;
    private editor;
    constructor(cell: Cell, runtime: Runtime);
    private getControls;
    attach(params: CellHandlerAttachParameters): void;
    private setupEditor;
    enterEditMode(mode: EditMode): void;
    run(): Promise<void>;
    dispose(): Promise<void>;
    focusEditor(opts: {
        position?: "start" | "end";
    }): void;
    clear(): void;
}
export {};

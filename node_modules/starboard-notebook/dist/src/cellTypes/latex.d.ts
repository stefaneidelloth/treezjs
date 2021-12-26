import { BaseCellHandler } from "./base";
import { Cell, CellHandlerAttachParameters, Runtime } from "../types";
export declare const LATEX_CELL_TYPE_DEFINITION: {
    name: string;
    cellType: string[];
    createHandler: (c: Cell, r: Runtime) => LatexCellHandler;
};
export declare class LatexCellHandler extends BaseCellHandler {
    private isInEditMode;
    private elements;
    private editor;
    constructor(cell: Cell, runtime: Runtime);
    private getControls;
    attach(params: CellHandlerAttachParameters): void;
    private setupEditor;
    enterEditMode(): void;
    run(): Promise<void>;
    dispose(): Promise<void>;
    focusEditor(opts: {
        position?: "start" | "end";
    }): void;
    clear(): void;
}

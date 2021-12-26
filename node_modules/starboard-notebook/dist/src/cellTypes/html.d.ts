import { BaseCellHandler } from "./base";
import { Cell, CellHandlerAttachParameters, Runtime } from "../types";
export declare const HTML_CELL_TYPE_DEFINITION: {
    name: string;
    cellType: string;
    createHandler: (c: Cell, r: Runtime) => HTMLCellHandler;
};
export declare class HTMLCellHandler extends BaseCellHandler {
    private elements;
    private editor;
    constructor(cell: Cell, runtime: Runtime);
    private getControls;
    attach(params: CellHandlerAttachParameters): void;
    run(): Promise<void>;
    focusEditor(opts: {
        position?: "start" | "end";
    }): void;
    dispose(): Promise<void>;
    clear(): void;
}

import { BaseCellHandler } from "./base";
import { Cell, CellHandlerAttachParameters, Runtime } from "../types";
export declare const CSS_CELL_TYPE_DEFINITION: {
    name: string;
    cellType: string;
    createHandler: (c: Cell, r: Runtime) => CSSCellHandler;
};
export declare class CSSCellHandler extends BaseCellHandler {
    private elements;
    private editor;
    private changeListener;
    constructor(cell: Cell, runtime: Runtime);
    attach(params: CellHandlerAttachParameters): void;
    run(): Promise<void>;
    focusEditor(opts: {
        position?: "start" | "end";
    }): void;
    dispose(): Promise<void>;
    clear(): void;
}

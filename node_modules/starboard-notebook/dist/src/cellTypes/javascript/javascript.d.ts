import { BaseCellHandler } from "../base";
import { Cell, CellHandlerAttachParameters, Runtime } from "../../types";
export declare const JAVASCRIPT_CELL_TYPE_DEFINITION: {
    name: string;
    cellType: string[];
    createHandler: (c: Cell, r: Runtime) => JavascriptCellHandler;
};
export declare class JavascriptCellHandler extends BaseCellHandler {
    private elements;
    private editor;
    private jsRunner;
    private isCurrentlyRunning;
    private lastRunId;
    private outputElement?;
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

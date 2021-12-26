import { BaseCellHandler } from "../base";
import { Cell } from "../../types";
import { CellHandlerAttachParameters, Runtime } from "../../types";
export declare const ES_MODULE_CELL_TYPE_DEFINITION: {
    name: string;
    cellType: string;
    createHandler: (c: Cell, r: Runtime) => ESModuleCellHandler;
};
export declare class ESModuleCellHandler extends BaseCellHandler {
    private elements;
    private editor;
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

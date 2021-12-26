import { Cell, CellHandler, CellHandlerAttachParameters, Runtime } from "../types";
export declare abstract class BaseCellHandler implements CellHandler {
    cell: Cell;
    runtime: Runtime;
    constructor(cell: Cell, runtime: Runtime);
    abstract attach(param: CellHandlerAttachParameters): void;
    run(): Promise<any>;
    dispose(): Promise<void>;
    focusEditor(_opts: {
        position?: "start" | "end";
    }): void;
    clear(): void;
}

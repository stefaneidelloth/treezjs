import { LitElement } from "lit";
import { BaseCellHandler } from "../cellTypes/base";
import { Cell, CellTypeDefinition, Runtime } from "../types";
import "./insertionLine";
export declare class CellElement extends LitElement {
    private topElement;
    private topControlsElement;
    private bottomElement;
    private bottomControlsElement;
    cellTypeDefinition: CellTypeDefinition;
    cellHandler: BaseCellHandler;
    cell: Cell;
    private isCurrentlyRunning;
    isBeingMoved: boolean;
    runtime: Runtime;
    constructor(cell: Cell, runtime: Runtime);
    createRenderRoot(): this;
    connectedCallback(): void;
    firstUpdated(changedProperties: any): void;
    run(): Promise<void>;
    focusEditor(opts: {
        position?: "start" | "end";
    }): void;
    clear(): void;
    changeCellType(newCellType: string | string[]): boolean;
    /**
     * Toggles the property between `true` and not present.
     * If force is passed it is deleted in case you pass `false`, and set to `true` in case of `true`.
     */
    private toggleProperty;
    private onTopGutterButtonClick;
    render(): import("lit").TemplateResult<1>;
    disconnectedCallback(): void;
}

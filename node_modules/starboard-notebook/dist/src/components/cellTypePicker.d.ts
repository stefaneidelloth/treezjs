import { LitElement } from "lit";
import { Runtime } from "../types";
import { Cell } from "../types";
export declare class CellTypePicker extends LitElement {
    onInsert: (data: Partial<Cell>) => any;
    private currentHighlight;
    private currentCellCreationInterface;
    private runtime;
    constructor(runtime: Runtime);
    createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    setHighlightedCellType(highlightCellType: string): void;
    private onClickCellType;
    private insertCell;
    render(): import("lit").TemplateResult<1>;
}

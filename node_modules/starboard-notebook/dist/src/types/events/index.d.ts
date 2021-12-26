import { Cell } from "../core";
declare global {
    interface HTMLElementEventMap {
        "sb:run_cell": RunCellEvent;
        "sb:run_all_cells": RunCellEvent;
        "sb:insert_cell": InsertCellEvent;
        "sb:change_cell_type": ChangeCellTypeEvent;
        "sb:set_cell_property": SetCellPropertyEvent;
        "sb:remove_cell": RemoveCellEvent;
        "sb:reset_cell": ResetCellEvent;
        "sb:focus_cell": FocusCellEvent;
        "sb:clear_cell": ClearCellEvent;
        "sb:move_cell": MoveCellEvent;
        "sb:save": SaveEvent;
    }
}
export interface StarboardEventMap {
    "sb:run_cell": RunCellEvent;
    "sb:run_all_cells": RunAllCellsEvent;
    "sb:insert_cell": InsertCellEvent;
    "sb:change_cell_type": ChangeCellTypeEvent;
    "sb:set_cell_property": SetCellPropertyEvent;
    "sb:remove_cell": RemoveCellEvent;
    "sb:reset_cell": ResetCellEvent;
    "sb:focus_cell": FocusCellEvent;
    "sb:clear_cell": ClearCellEvent;
    "sb:move_cell": MoveCellEvent;
    "sb:save": SaveEvent;
}
export declare type StarboardEventName = keyof StarboardEventMap;
export declare type StarboardEvent = StarboardEventMap[keyof StarboardEventMap];
export declare type StarboardEventInitDict<EV extends CustomEvent> = EV["detail"];
export declare type InsertCellOptions = {
    adjacentCellId?: string;
    position: "before" | "after" | "notebookEnd";
    data?: Partial<Cell>;
};
export declare type InsertCellEvent = CustomEvent<InsertCellOptions>;
export declare type RunCellOptions = {
    id: string;
};
export declare type RunCellEvent = CustomEvent<RunCellOptions>;
export declare type RunAllCellsOptions = {
    onlyRunOnLoad?: boolean;
    isInitialRun?: boolean;
};
export declare type RunAllCellsEvent = CustomEvent<RunAllCellsOptions>;
export declare type RemoveCellOptions = {
    id: string;
};
export declare type RemoveCellEvent = CustomEvent<RemoveCellOptions>;
export declare type ChangeCellTypeOptions = {
    id: string;
    newCellType: string;
};
export declare type ChangeCellTypeEvent = CustomEvent<ChangeCellTypeOptions>;
export declare type SetCellPropertyOptions = {
    id: string;
    property: string;
    value: any;
};
export declare type SetCellPropertyEvent = CustomEvent<SetCellPropertyOptions>;
export declare type ResetCellOptions = {
    id: string;
};
/** Resets the given cell, recreating the entire thing. */
export declare type ResetCellEvent = CustomEvent<ResetCellOptions>;
export declare type FocusCellOptions = {
    id: string;
    focusTarget?: "previous" | "next";
};
export declare type FocusCellEvent = CustomEvent<FocusCellOptions>;
export declare type ClearCellOptions = {
    id: string;
};
export declare type ClearCellEvent = CustomEvent<ClearCellOptions>;
export declare type MoveCellOptions = {
    id: string;
    fromIndex: number;
    toIndex: number;
};
export declare type MoveCellEvent = CustomEvent<MoveCellOptions>;
export declare type SaveEvent = CustomEvent<Record<string, never>>;

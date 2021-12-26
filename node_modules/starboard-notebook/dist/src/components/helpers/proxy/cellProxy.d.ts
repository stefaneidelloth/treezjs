import { Cell } from "../../../types";
/**
 * Wraps given cell in a proxy. This proxy will call the changedCallback whenever the cell changes in
 * such a way that would change the text representation of the cell.
 * @param cell
 * @param changedCallback
 */
export declare function createCellProxy(cell: Cell, changedCallback: () => void): Cell;

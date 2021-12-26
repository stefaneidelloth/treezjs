import { Cell, NotebookContent, Runtime } from "../types";
/**
 * Finds the given cell index, if not present throws an error
 * @param cells
 * @param id
 * @returns
 */
export declare function requireIndexOfCellId(cells: Cell[], id?: string): number;
/**
 * Returns the ID of the created cell
 */
export declare function addCellToNotebookContent(runtime: Runtime, data: Partial<Cell> | undefined, position: "notebookEnd" | "before" | "after", adjacentCellId?: string): string;
export declare function removeCellFromNotebookById(nb: NotebookContent, id: string): void;
/**
 * Returns whether the cell type is different from the previous cell type.
 */
export declare function changeCellType(nb: NotebookContent, id: string, newCellType: string): boolean;

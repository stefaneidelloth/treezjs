import { NotebookContent } from "../types";
export declare const CellDelimiterRegex: RegExp;
export interface ParsedCell {
    type: string;
    metadata: any;
    lines: string[];
}
export declare function textToNotebookContent(text: string): NotebookContent;
/**
 * Parses the given notebook file content string into the frontmatter and ParsedCell structure.
 */
export declare function parseNotebookContent(notebookContentString: string): {
    cells: ParsedCell[];
    metadata: {};
};

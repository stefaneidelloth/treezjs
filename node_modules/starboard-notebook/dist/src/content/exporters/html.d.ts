import { NotebookContent } from "../../types";
import "./bufferMock";
/**
 *
 * @param content
 * @param opts cdnPrefix should end with a "/"
 */
export declare function exportAsHtml(content: NotebookContent, opts: {
    cdnPrefix: string;
}): string;

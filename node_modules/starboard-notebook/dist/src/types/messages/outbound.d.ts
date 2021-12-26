import { NotebookMessage, NotebookMessageContentData } from ".";
export declare type OutboundNotebookMessage = ContentUpdateMessage | ReadySignalMessage | SaveMessage | ResizeMessage;
/**
 * Sent from notebook to parent webpage when the textual representation of the notebook changes in any way.
 * E.g. whenever a character is typed.
 *
 * There is some debouncing/rate limiting to ensure this doesn't fire too often.
 */
export declare type ContentUpdateMessage = NotebookMessage<"NOTEBOOK_CONTENT_UPDATE", {
    content: NotebookMessageContentData;
}>;
/**
 * Sent from notebook when it is ready to receive the initial content.
 */
export declare type ReadySignalMessage = NotebookMessage<"NOTEBOOK_READY_SIGNAL", {
    /**
     * Version of these communication messages, currently always 1.
     */
    communicationFormatVersion: 1;
    /**
     * The content at the time of the ready signal, this will likely be an empty string, but can be
     * actual content in case the notebook content gets set from within the iframe.
     */
    content: NotebookMessageContentData;
    runtime: {
        name: "starboard-notebook";
        /**
         * The version of Starboard Notebook
         */
        version: string;
    };
}>;
/**
 * Sent from notebook to parent webpage when the user initiates a save (e.g. by pressing CTRL+S on Windows).
 */
export declare type SaveMessage = NotebookMessage<"NOTEBOOK_SAVE_REQUEST", {
    content: NotebookMessageContentData;
}>;
export declare type ResizeMessage = NotebookMessage<"NOTEBOOK_RESIZE_REQUEST", {
    width: number;
    height: number;
}>;

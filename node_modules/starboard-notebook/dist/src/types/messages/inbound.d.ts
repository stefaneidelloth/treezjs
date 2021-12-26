import { NotebookMetadata } from "../core";
import { NotebookMessage, NotebookMessageContentData } from ".";
export interface NotebookInitPayload {
    content: NotebookMessageContentData;
    baseUrl?: string;
}
export interface NotebookSetMetadataPayload {
    metadata: NotebookMetadata;
}
export declare type InboundNotebookMessage = SetContentMessage | ReloadMessage | SetMetdataMessage;
/**
 * Sent from parent webpage to notebook to set the initial content and configuration of the notebook.
 */
export declare type SetContentMessage = NotebookMessage<"NOTEBOOK_SET_INIT_DATA", NotebookInitPayload>;
/**
 * Sent from parent webpage to notebook to overwrite the metadata
 */
export declare type SetMetdataMessage = NotebookMessage<"NOTEBOOK_SET_METADATA", NotebookSetMetadataPayload>;
/**
 * Sent from parent webpage to notebook to trigger a page refresh of the iframe, this is somewhat equivalent to a "kernel reset" in Jupyter.
 */
export declare type ReloadMessage = NotebookMessage<"NOTEBOOK_RELOAD_PAGE", undefined>;

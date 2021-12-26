export * from "./inbound";
export * from "./outbound";
/**
 * Description of the content of the notebook
 */
export declare type NotebookMessageContentData = string;
/**
 * The base type of a message sent to or from an iframe containing a Starboard Notebook.
 */
export declare type NotebookMessage<Name extends string, PayloadType> = {
    type: Name;
    payload: PayloadType;
};

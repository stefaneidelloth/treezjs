import { ContentUpdateMessage, InboundNotebookMessage, NotebookMessage, OutboundNotebookMessage, ReadySignalMessage, SaveMessage } from "starboard-notebook/dist/src/types/messages";
export declare type StarboardNotebookIFrameOptions<ReceivedMessageType = OutboundNotebookMessage> = {
    /**
     * Optionally you can pass the iframe to attach to. If you don't pass one here
     * an iframe will be created as a child unless the starboard-embed element already has an iframe as a child.
     */
    iFrame: HTMLIFrameElement | null;
    src: string;
    autoResize: boolean;
    baseUrl?: string;
    /**
     * Notebook content to initialize the iframe with
     */
    notebookContent?: Promise<string> | string;
    onNotebookReadySignalMessage(payload: ReadySignalMessage["payload"]): void;
    /**
     * Should return whether the saving was succesful or not.
     */
    onSaveMessage(payload: SaveMessage["payload"]): void | boolean | Promise<boolean>;
    onContentUpdateMessage(payload: ContentUpdateMessage["payload"]): void;
    onMessage(message: ReceivedMessageType): void;
    onUnsavedChangesStatusChange(hasUnsavedChanges: boolean): void;
    /**
     * Custom iframe sandboxing attributes
     */
    sandbox: string;
    /**
     * Custom iframe allow attribute value
     */
    allow: string;
    preventNavigationWithUnsavedChanges: boolean;
};
export declare type StarboardNotebookMessage = {
    type: "SIGNAL_READY" | "SET_NOTEBOOK_CONTENT" | "NOTEBOOK_CONTENT_UPDATE" | "SAVE";
};
export declare class StarboardEmbed extends HTMLElement {
    private options?;
    private constructorOptions;
    notebookContent: string;
    lastSavedNotebookContent: string;
    /** Has unsaved changes */
    dirty: boolean;
    version: string;
    /**
     * The wrapped iframe element.
     */
    private iFrame;
    private hasReceivedReadyMessage;
    private iFrameMessageHandler?;
    private unsavedChangesWarningFunction?;
    constructor(opts?: Partial<StarboardNotebookIFrameOptions>);
    connectedCallback(): void;
    sendMessage(message: InboundNotebookMessage): void;
    /**
     * Tell the embed a save has been made with the given content so it can update it's "dirty" status.
     * If no content is supplied, the current content is assumed to be the just saved content.
     */
    setSaved(content?: string): void;
    private updateDirty;
    sendCustomMessage(message: NotebookMessage<string, any>): void;
    dispose(): void;
}

import MarkdownIt from "markdown-it";
export declare function isSharedArrayBufferAndAtomicsReady(): boolean;
export declare function serviceWorkerCanBeRegisteredAtCorrectScope(): {
    ok: true;
} | {
    ok: false;
    reason: string;
};
export declare function hookMarkdownItCrossOriginImages(markdownItInstance: MarkdownIt, withShortcuts?: boolean): void;

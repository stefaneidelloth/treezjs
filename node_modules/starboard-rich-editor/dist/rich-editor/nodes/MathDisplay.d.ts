import Node from "rich-markdown-editor/dist/nodes/Node";
export default class MathDisplay extends Node {
    get name(): string;
    get schema(): {
        group: string;
        content: string;
        block: boolean;
        atom: boolean;
        toDOM: () => (string | number | {
            class: string;
            spellcheck: string;
        })[];
        parseDOM: {
            tag: string;
        }[];
    };
    commands({ type }: {
        type: any;
    }): () => import("prosemirror-commands").Command<any>;
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
        noCloseToken: boolean;
    };
}

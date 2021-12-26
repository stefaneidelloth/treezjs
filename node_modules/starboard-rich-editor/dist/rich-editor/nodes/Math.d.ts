import Node from "rich-markdown-editor/dist/nodes/Node";
import "katex/dist/katex.min.css";
import "@benrbray/prosemirror-math/style/math.css";
export default class Math extends Node {
    get name(): string;
    get schema(): {
        group: string;
        content: string;
        inline: boolean;
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
    inputRules({ schema }: {
        schema: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    keys({ type }: {
        type: any;
    }): {
        "Mod-Space": import("prosemirror-commands").Command<any>;
        Backspace: import("prosemirror-commands").Command<any>;
    };
    get plugins(): import("prosemirror-state").Plugin<import("@benrbray/prosemirror-math").IMathPluginState, any>[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
        noCloseToken: boolean;
    };
}

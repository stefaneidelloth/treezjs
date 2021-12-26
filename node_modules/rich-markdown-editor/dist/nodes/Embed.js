"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const Node_1 = __importDefault(require("./Node"));
const embeds_1 = __importDefault(require("../rules/embeds"));
const cache = {};
class Embed extends Node_1.default {
    get name() {
        return "embed";
    }
    get schema() {
        return {
            content: "inline*",
            group: "block",
            atom: true,
            attrs: {
                href: {},
            },
            parseDOM: [
                {
                    tag: "iframe[class=embed]",
                    getAttrs: (dom) => {
                        const { embeds } = this.editor.props;
                        const href = dom.getAttribute("src") || "";
                        if (embeds) {
                            for (const embed of embeds) {
                                const matches = embed.matcher(href);
                                if (matches) {
                                    return {
                                        href,
                                    };
                                }
                            }
                        }
                        return {};
                    },
                },
            ],
            toDOM: node => [
                "iframe",
                { class: "embed", src: node.attrs.href, contentEditable: false },
                0,
            ],
        };
    }
    get rulePlugins() {
        return [embeds_1.default(this.options.embeds)];
    }
    component({ isEditable, isSelected, theme, node }) {
        const { embeds } = this.editor.props;
        const hit = cache[node.attrs.href];
        let Component = hit ? hit.Component : undefined;
        let matches = hit ? hit.matches : undefined;
        if (!Component) {
            for (const embed of embeds) {
                const m = embed.matcher(node.attrs.href);
                if (m) {
                    Component = embed.component;
                    matches = m;
                    cache[node.attrs.href] = { Component, matches };
                }
            }
        }
        if (!Component) {
            return null;
        }
        return (React.createElement(Component, { attrs: Object.assign(Object.assign({}, node.attrs), { matches }), isEditable: isEditable, isSelected: isSelected, theme: theme }));
    }
    commands({ type }) {
        return attrs => (state, dispatch) => {
            dispatch(state.tr.replaceSelectionWith(type.create(attrs)).scrollIntoView());
            return true;
        };
    }
    toMarkdown(state, node) {
        state.ensureNewLine();
        state.write("[" + state.esc(node.attrs.href) + "](" + state.esc(node.attrs.href) + ")");
        state.write("\n\n");
    }
    parseMarkdown() {
        return {
            node: "embed",
            getAttrs: token => ({
                href: token.attrGet("href"),
            }),
        };
    }
}
exports.default = Embed;
//# sourceMappingURL=Embed.js.map
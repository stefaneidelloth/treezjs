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
const BlockMenuItem_1 = __importDefault(require("./BlockMenuItem"));
const styled_components_1 = __importDefault(require("styled-components"));
const Emoji = styled_components_1.default.span `
  font-size: 16px;
`;
const EmojiTitle = ({ emoji, title, }) => {
    return (React.createElement("p", null,
        React.createElement(Emoji, { className: "emoji" }, emoji),
        "\u00A0\u00A0",
        title));
};
function EmojiMenuItem(props) {
    return (React.createElement(BlockMenuItem_1.default, Object.assign({}, props, { title: React.createElement(EmojiTitle, { emoji: props.emoji, title: props.title }) })));
}
exports.default = EmojiMenuItem;
//# sourceMappingURL=EmojiMenuItem.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rules_1 = __importDefault(require("./markdown/rules"));
const mark_1 = __importDefault(require("../rules/mark"));
const checkboxes_1 = __importDefault(require("../rules/checkboxes"));
const embeds_1 = __importDefault(require("../rules/embeds"));
const breaks_1 = __importDefault(require("../rules/breaks"));
const tables_1 = __importDefault(require("../rules/tables"));
const notices_1 = __importDefault(require("../rules/notices"));
const underlines_1 = __importDefault(require("../rules/underlines"));
const markdown_it_emoji_1 = __importDefault(require("markdown-it-emoji"));
const defaultRules = [
    embeds_1.default,
    breaks_1.default,
    checkboxes_1.default,
    mark_1.default({ delim: "==", mark: "highlight" }),
    mark_1.default({ delim: "!!", mark: "placeholder" }),
    underlines_1.default,
    tables_1.default,
    notices_1.default,
    markdown_it_emoji_1.default,
];
function renderToHtml(markdown, rulePlugins = defaultRules) {
    return rules_1.default({ plugins: rulePlugins })
        .render(markdown)
        .trim();
}
exports.default = renderToHtml;
//# sourceMappingURL=renderToHtml.js.map
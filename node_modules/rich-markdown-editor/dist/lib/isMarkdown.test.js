"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isMarkdown_1 = __importDefault(require("./isMarkdown"));
test("returns false for an empty string", () => {
    expect(isMarkdown_1.default("")).toBe(false);
});
test("returns false for plain text", () => {
    expect(isMarkdown_1.default("plain text")).toBe(false);
});
test("returns true for bullet list", () => {
    expect(isMarkdown_1.default(`- item one
- item two
  - nested item`)).toBe(true);
});
test("returns true for numbered list", () => {
    expect(isMarkdown_1.default(`1. item one
1. item two`)).toBe(true);
    expect(isMarkdown_1.default(`1. item one
2. item two`)).toBe(true);
});
test("returns true for code fence", () => {
    expect(isMarkdown_1.default(`\`\`\`javascript
this is code
\`\`\``)).toBe(true);
});
test("returns false for non-closed fence", () => {
    expect(isMarkdown_1.default(`\`\`\`
this is not code
`)).toBe(false);
});
test("returns true for heading", () => {
    expect(isMarkdown_1.default(`# Heading 1`)).toBe(true);
    expect(isMarkdown_1.default(`## Heading 2`)).toBe(true);
    expect(isMarkdown_1.default(`### Heading 3`)).toBe(true);
});
test("returns false for hashtag", () => {
    expect(isMarkdown_1.default(`Test #hashtag`)).toBe(false);
    expect(isMarkdown_1.default(` #hashtag`)).toBe(false);
});
test("returns true for absolute link", () => {
    expect(isMarkdown_1.default(`[title](http://www.google.com)`)).toBe(true);
});
test("returns true for relative link", () => {
    expect(isMarkdown_1.default(`[title](/doc/mydoc-234tnes)`)).toBe(true);
});
test("returns true for relative image", () => {
    expect(isMarkdown_1.default(`![alt](/coolimage.png)`)).toBe(true);
});
test("returns true for absolute image", () => {
    expect(isMarkdown_1.default(`![alt](https://www.google.com/coolimage.png)`)).toBe(true);
});
//# sourceMappingURL=isMarkdown.test.js.map
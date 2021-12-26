"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isMarkdown(text) {
    const fences = text.match(/^```/gm);
    if (fences && fences.length > 1)
        return true;
    if (text.match(/\[[^]+\]\(https?:\/\/\S+\)/gm))
        return true;
    if (text.match(/\[[^]+\]\(\/\S+\)/gm))
        return true;
    if (text.match(/^#{1,6}\s+\S+/gm))
        return true;
    const listItems = text.match(/^[\d-*].?\s\S+/gm);
    if (listItems && listItems.length > 1)
        return true;
    return false;
}
exports.default = isMarkdown;
//# sourceMappingURL=isMarkdown.js.map
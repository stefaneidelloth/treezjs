import { generateUniqueId } from "./random";
function highlight(markdownIt, opts, text, lang) {
    const cmHighlight = import(
    /* webpackChunkName: "codemirrorHighlight", webpackPrefetch: true */ "../editor/codemirror/highlight");
    // An empty line is inserted without this at the end in codemirror, not sure why.
    if (text.endsWith("\n")) {
        text = text.substring(0, text.length - 1);
    }
    const uid = generateUniqueId(12);
    cmHighlight
        .then((cm) => {
        return cm.createCodeMirrorCodeHighlight(text, { language: lang });
    })
        .then((ev) => {
        const placeholderEl = document.getElementById(uid);
        if (placeholderEl) {
            placeholderEl.id = "";
            placeholderEl.innerText = "";
            placeholderEl.appendChild(ev.contentDOM);
        }
    });
    // Placeholder while we load codemirror asynchrionously.
    const placeholder = `<pre><code id="${uid}">${text}</code></pre>`;
    return placeholder;
}
function markdownItCodemirrorHighlight(markdownit, userOptions) {
    // register ourselves as highlighter
    markdownit.options.highlight = (text, lang) => highlight(markdownit, userOptions, text, lang);
}
export function hookMarkdownItToCodemirrorHighlighter(markdownItInstance) {
    markdownItInstance.use(markdownItCodemirrorHighlight);
}
//# sourceMappingURL=highlight.js.map
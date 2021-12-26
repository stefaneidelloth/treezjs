import mdlib from "markdown-it";
export declare function getMarkdownItWithDefaultPlugins(markdownitOpts?: mdlib.Options): {
    md: mdlib;
    katexLoaded: Promise<void>;
};

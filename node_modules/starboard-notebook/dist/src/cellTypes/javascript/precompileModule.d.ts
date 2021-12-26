/**
 * Precompile takes a cell's code as a string, parses it and transforms it.
 * In particular it wraps everything in an async function, handles the var->global magic,
 * and its output can be used to set $_ to the last statement.
 */
export declare function precompileJavascriptCode(content: string): Promise<string>;

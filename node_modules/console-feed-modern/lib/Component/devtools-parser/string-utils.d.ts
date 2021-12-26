export declare namespace String {
    /**
     * @param {string} format
     * @param {?ArrayLike} substitutions
     * @param {!Object.<string, function(string, ...):Q>} formatters
     * @param {!T} initialValue
     * @param {function(T, Q): T|undefined} append
     * @param {!Array.<!Object>=} tokenizedFormat
     * @return {!{formattedResult: T, unusedSubstitutions: ?ArrayLike}};
     * @template T, Q
     */
    function format(format?: any, substitutions?: any, formatters?: any, initialValue?: any, append?: any, tokenizedFormat?: any): {
        formattedResult: any;
        unusedSubstitutions: any;
    };
}

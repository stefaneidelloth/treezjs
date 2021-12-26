export declare function isProbablyTemplateResult(value: any): boolean;
/**
 * Checks the state of a promise more or less 'right now'.
 * @param p
 */
export declare function promiseState(p: Promise<any>): Promise<"pending" | "fulfilled" | "rejected">;

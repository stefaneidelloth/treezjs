export interface ThrottleOptions {
    /**
     * Fire immediately on the first call.
     */
    start?: boolean;
    /**
     * Fire as soon as `wait` has passed.
     */
    middle?: boolean;
    /**
     * Cancel after the first successful call.
     */
    once?: boolean;
}
interface Throttler<T extends unknown[]> {
    (...args: T): void;
    cancel(): void;
}
export declare function throttle<T extends unknown[]>(callback: (...args: T) => unknown, wait?: number, { start, middle, once }?: ThrottleOptions): Throttler<T>;
export declare function debounce<T extends unknown[]>(callback: (...args: T) => unknown, wait?: number, { start, middle, once }?: ThrottleOptions): Throttler<T>;
export {};
//# sourceMappingURL=index.d.ts.map
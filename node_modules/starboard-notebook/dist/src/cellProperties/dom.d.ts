/**
 * A cell with metadata
 * ```
 * properties: {
 *   locked: true,
 *   run_on_load: "123",
 *   no: false,
 * }
 * ```
 *
 * will get classes "property-locked property-run_on_load property-no" if those are known properties.
 * All `Object.getOwnPropertyNames` properties get added (or removed if not present).
 * Unknown properties don't get CSS classes added.
 *
 * @param properties
 */
export declare function syncPropertyElementClassNames(el: HTMLElement, properties: Record<string, any>): void;

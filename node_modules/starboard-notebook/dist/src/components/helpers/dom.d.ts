/**
 * Inserts HTML element into parent's children at given index.
 * @param parent
 * @param child element to be inserted
 * @param index where to insert, should be a positive number, defaults to 0.
 */
export declare function insertHTMLChildAtIndex(parent: HTMLElement, child: HTMLElement, index?: number): void;
export declare function hasParentWithId(el: HTMLElement | Element | null, id: string): boolean;

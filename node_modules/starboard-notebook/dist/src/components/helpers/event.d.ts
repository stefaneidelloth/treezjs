import { StarboardEventInitDict, StarboardEventMap, StarboardEventName } from "../../types/events";
export declare function createStarboardEvent<E extends StarboardEventName>(name: E, detail: StarboardEventInitDict<StarboardEventMap[E]>): CustomEvent<StarboardEventMap[E]>;
/**
 * ```javascript
 * dispatchStarboardEvent(myElement, "sb:run_cell", {id: "some-id"})
 * ```
 *
 * is a shorthand for
 *
 * ```javascript
 * myElement.dispatchEvent(createStarboardEvent("sb:run_cell", {id: "some-id"}))
 * ```
 * It allows you to not have to import a bunch of complicated types.
 *
 * Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
 */
export declare function dispatchStarboardEvent<E extends StarboardEventName>(target: HTMLElement, name: E, detail: StarboardEventInitDict<StarboardEventMap[E]>): boolean;

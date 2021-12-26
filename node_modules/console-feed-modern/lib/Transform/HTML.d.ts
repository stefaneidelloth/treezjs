interface Storage {
    tagName: string;
    attributes: {
        [attribute: string]: string;
    };
    innerHTML: string;
}
declare const _default: {
    type: string;
    shouldTransform(type: any, obj: any): boolean;
    toSerializable(element: HTMLElement): Storage;
    fromSerializable(data: Storage): HTMLElement | Storage;
};
/**
 * Serialize a HTML element into JSON
 */
export default _default;

interface Storage {
    name: string;
    body: string;
    proto: string;
}
declare const _default: {
    type: string;
    shouldTransform(type: any, obj: any): boolean;
    toSerializable(func: Function): Storage;
    fromSerializable(data: Storage): Storage | (() => void);
};
/**
 * Serialize a function into JSON
 */
export default _default;

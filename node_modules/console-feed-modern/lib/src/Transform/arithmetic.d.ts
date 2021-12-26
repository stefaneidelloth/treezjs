declare enum Arithmetic {
    infinity = 0,
    minusInfinity = 1,
    minusZero = 2
}
declare const _default: {
    type: string;
    shouldTransform(type: any, value: any): boolean;
    toSerializable(value: any): Arithmetic;
    fromSerializable(data: Arithmetic): number;
};
export default _default;

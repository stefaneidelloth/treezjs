interface GetScale {
    height: number;
    innerHeight: number;
    innerWidth: number;
    width: number;
    zoomMargin: number;
}
export declare const getScale: ({ height, innerHeight, innerWidth, width, zoomMargin }: GetScale) => number;
interface GetModalContentStyle {
    height: number;
    innerHeight: number;
    innerWidth: number;
    isLoaded: boolean;
    isUnloading: boolean;
    left: number;
    originalTransform: string | null;
    top: number;
    transitionDuration: number;
    width: number;
    zoomMargin: number;
}
declare type GetModalContentStyleReturnType = {
    height: number;
    left: number;
    top: number;
    transform: string;
    WebkitTransform: string;
    transitionDuration: string;
    width: number;
};
export declare const getModalContentStyle: ({ height, innerHeight, innerWidth, isLoaded, isUnloading, left, originalTransform, top, transitionDuration, width, zoomMargin }: GetModalContentStyle) => GetModalContentStyleReturnType;
interface GetModalOverlayStyle {
    isLoaded: boolean;
    isUnloading: boolean;
    overlayBgColorEnd: string;
    overlayBgColorStart: string;
    transitionDuration: number;
    zoomZindex: number;
}
declare type GetModalOverlayStyleReturnType = {
    backgroundColor: string;
    transitionDuration: string;
    zIndex: number;
};
export declare const getModalOverlayStyle: ({ isLoaded, isUnloading, overlayBgColorEnd, overlayBgColorStart, transitionDuration, zoomZindex }: GetModalOverlayStyle) => GetModalOverlayStyleReturnType;
declare type GetBoundingClientRectReturnType = {
    height: number;
    left: number;
    top: number;
    width: number;
};
export declare const pseudoParentEl: {
    getBoundingClientRect: () => GetBoundingClientRectReturnType;
    style: {
        transform: null;
    };
};
export {};

export interface ImageZoom {
    (opts?: Opts): ({
        attach: Attach;
        detach: Detach;
        teardown: Teardown;
        unzoom: Unzoom;
        update: Update;
        zoom: Zoom;
    });
}
export interface Opts {
    auto?: boolean;
    margin?: number;
    onChange?: ({ type, value }: {
        type: string;
        value: string | boolean;
    }) => void;
    overlayBgColor?: string;
    overlayOpacity?: number;
    transitionDuration?: number;
    unzoomLabel?: string;
    zIndex?: number;
    zoomLabel?: string;
    zoomTitle?: string;
}
export interface Attach {
    (...els: (HTMLImageElement | HTMLImageElement[] | NodeListOf<HTMLImageElement> | SVGElement | SVGElement[] | NodeListOf<SVGElement>)[]): void;
}
export interface Detach {
    (el: HTMLImageElement | SVGElement, skipTracking?: boolean): void;
}
export interface Reset {
    (): void;
}
export interface Teardown {
    (): void;
}
export interface Update {
    (opts: Opts): void;
}
export interface Unzoom {
    (): void;
}
export interface Zoom {
    (el: HTMLImageElement | SVGElement | EventTarget | null): void;
}
declare const imageZoom: ImageZoom;
export default imageZoom;

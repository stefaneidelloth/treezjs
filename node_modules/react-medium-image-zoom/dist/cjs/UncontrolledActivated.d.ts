import React, { ReactNode, RefObject } from 'react';
import './styles.css';
interface Props {
    children: ReactNode;
    closeText?: string;
    onUnload: () => void;
    onLoad: () => void;
    overlayBgColorEnd?: string;
    overlayBgColorStart?: string;
    parentRef: RefObject<HTMLElement>;
    portalEl?: HTMLElement;
    scrollableEl?: HTMLElement | Window;
    transitionDuration?: number;
    zoomMargin?: number;
    zoomZindex?: number;
}
declare const _default: React.NamedExoticComponent<Props>;
export default _default;

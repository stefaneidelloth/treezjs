import 'focus-options-polyfill';
import React, { CSSProperties, ReactNode, ReactType } from 'react';
import './styles.css';
interface Props {
    children: ReactNode;
    closeText?: string;
    openText?: string;
    overlayBgColorEnd?: string;
    overlayBgColorStart?: string;
    portalEl?: HTMLElement;
    scrollableEl?: HTMLElement | Window;
    transitionDuration?: number;
    wrapElement?: ReactType;
    wrapStyle?: CSSProperties;
    zoomMargin?: number;
    zoomZindex?: number;
}
declare const _default: React.NamedExoticComponent<Props>;
export default _default;

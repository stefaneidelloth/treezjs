import 'focus-options-polyfill';
import React, { memo, useRef, useState, useCallback, useEffect, StrictMode } from 'react';
import { createPortal } from 'react-dom';
import useEvent from 'react-use/lib/useEvent';
import useWindowSize from 'react-use/lib/useWindowSize';
import 'tslib';
import { pseudoParentEl, getModalOverlayStyle, getModalContentStyle } from './helpers.js';
import usePrevious from 'react-use/lib/usePrevious';

var ControlledActivated = function (_a) {
    var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom Image' : _b, isActiveFromParent = _a.isActive, onLoad = _a.onLoad, onUnload = _a.onUnload, onZoomChange = _a.onZoomChange, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, parentRef = _a.parentRef, _e = _a.portalEl, portalEl = _e === void 0 ? document.body : _e, _f = _a.scrollableEl, scrollableEl = _f === void 0 ? window : _f, _g = _a.transitionDuration, transitionDuration = _g === void 0 ? 300 : _g, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
    var btnRef = useRef(null);
    var _k = useState(0), forceUpdate = _k[1];
    var _l = useState(isActiveFromParent), isActive = _l[0], setIsActive = _l[1];
    var _m = useState(false), isLoaded = _m[0], setIsLoaded = _m[1];
    var _o = useState(false), isUnloading = _o[0], setIsUnloading = _o[1];
    var prevIsActive = usePrevious(isActive);
    var prevIsActiveFromParent = usePrevious(isActiveFromParent);
    var prevIsLoaded = usePrevious(isLoaded);
    var _p = useWindowSize(), innerWidth = _p.width, innerHeight = _p.height;
    // on click, tell caller it should zoom
    var handleClick = useCallback(function (e) {
        e.preventDefault();
        if (onZoomChange) {
            onZoomChange(false);
        }
    }, [onZoomChange]);
    // on escape, tell caller it should unzoom
    var handleKeyDown = useCallback(function (e) {
        if (isActive && (e.key === 'Escape' || e.keyCode === 27)) {
            e.stopPropagation();
            if (onZoomChange) {
                onZoomChange(false);
            }
        }
    }, [isActive, onZoomChange]);
    var handleScroll = useCallback(function () {
        forceUpdate(function (n) { return n + 1; });
        if (!isUnloading && onZoomChange) {
            onZoomChange(false);
        }
    }, [isUnloading, onZoomChange]);
    // listen for keydown on the document
    useEvent('keydown', handleKeyDown, document);
    // listen for scroll and close
    useEvent('scroll', handleScroll, scrollableEl);
    // set loaded on mount and focus
    useEffect(function () {
        if (!prevIsActive && isActive) {
            setIsLoaded(true);
            if (btnRef.current) {
                btnRef.current.focus({ preventScroll: true });
            }
        }
    }, [isActive, prevIsActive]);
    useEffect(function () {
        // when parent says to deactivate, begin unloading process
        if (prevIsActiveFromParent && !isActiveFromParent) {
            setIsUnloading(true);
        }
        // when parent says to activate, begin active process
        if (!prevIsActiveFromParent && isActiveFromParent) {
            setIsActive(true);
        }
    }, [isActiveFromParent, prevIsActiveFromParent]);
    // if unloading, tell parent that we're all done here after Nms
    useEffect(function () {
        var unloadTimeout;
        if (isUnloading) {
            unloadTimeout = setTimeout(function () {
                setIsLoaded(false);
                setIsActive(false);
                setIsUnloading(false);
            }, transitionDuration);
        }
        return function () {
            clearTimeout(unloadTimeout);
        };
    }, [isUnloading, transitionDuration]);
    // let parent know of changes to load status
    useEffect(function () {
        if (!prevIsLoaded && isLoaded) {
            onLoad();
        }
        if (prevIsLoaded && !isLoaded) {
            onUnload();
        }
    }, [isLoaded, onLoad, onUnload, prevIsLoaded]);
    // use parent element or fake one if it's not yet loaded
    var parentEl = parentRef.current || pseudoParentEl;
    // get parent element's dimensions
    var _q = parentEl.getBoundingClientRect(), height = _q.height, left = _q.left, top = _q.top, width = _q.width;
    var overlayStyle = getModalOverlayStyle({
        isLoaded: isLoaded,
        isUnloading: isUnloading,
        overlayBgColorEnd: overlayBgColorEnd,
        overlayBgColorStart: overlayBgColorStart,
        transitionDuration: transitionDuration,
        zoomZindex: zoomZindex
    });
    var contentStyle = getModalContentStyle({
        height: height,
        isLoaded: isLoaded,
        innerHeight: innerHeight,
        innerWidth: innerWidth,
        isUnloading: isUnloading,
        left: left,
        originalTransform: parentEl.style.transform,
        top: top,
        transitionDuration: transitionDuration,
        width: width,
        zoomMargin: zoomMargin
    });
    return isActive
        ? createPortal(React.createElement("div", { "aria-modal": true, "data-rmiz-overlay": true, role: "dialog", style: overlayStyle },
            React.createElement("div", { "data-rmiz-modal-content": true, style: contentStyle }, children),
            React.createElement("button", { "aria-label": closeText, "data-rmiz-btn-close": true, onClick: handleClick, ref: btnRef, type: "button" })), portalEl)
        : null;
};
var ControlledActivated$1 = memo(ControlledActivated);

var Controlled = function (_a) {
    var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom image' : _b, isActive = _a.isZoomed, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, portalEl = _a.portalEl, onZoomChange = _a.onZoomChange, _e = _a.openText, openText = _e === void 0 ? 'Zoom image' : _e, scrollableEl = _a.scrollableEl, _f = _a.transitionDuration, transitionDuration = _f === void 0 ? 300 : _f, _g = _a.wrapElement, WrapElement = _g === void 0 ? 'div' : _g, wrapStyle = _a.wrapStyle, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
    var _k = useState(false), isChildLoaded = _k[0], setIsChildLoaded = _k[1];
    var wrapRef = useRef(null);
    var btnRef = useRef(null);
    var handleClickTrigger = useCallback(function (e) {
        if (!isActive && onZoomChange) {
            e.preventDefault();
            onZoomChange(true);
        }
    }, [isActive, onZoomChange]);
    var handleChildLoad = useCallback(function () {
        setIsChildLoaded(true);
    }, []);
    var handleChildUnload = useCallback(function () {
        setIsChildLoaded(false);
        if (btnRef.current) {
            btnRef.current.focus({ preventScroll: true });
        }
    }, []);
    var wrapType = isChildLoaded ? 'hidden' : 'visible';
    return (React.createElement(StrictMode, null,
        React.createElement(WrapElement, { "data-rmiz-wrap": wrapType, ref: wrapRef, style: wrapStyle },
            children,
            React.createElement("button", { "aria-label": openText, "data-rmiz-btn-open": true, onClick: handleClickTrigger, ref: btnRef, type: "button" }),
            typeof window !== 'undefined' && (React.createElement(ControlledActivated$1, { closeText: closeText, isActive: isActive, onLoad: handleChildLoad, onUnload: handleChildUnload, onZoomChange: onZoomChange, overlayBgColorEnd: overlayBgColorEnd, overlayBgColorStart: overlayBgColorStart, parentRef: wrapRef, portalEl: portalEl, scrollableEl: scrollableEl, transitionDuration: transitionDuration, zoomMargin: zoomMargin, zoomZindex: zoomZindex }, children)))));
};
var Controlled$1 = memo(Controlled);

export default Controlled$1;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('focus-options-polyfill');
var React = require('react');
var React__default = _interopDefault(React);
var reactDom = require('react-dom');
var useEvent = _interopDefault(require('react-use/lib/useEvent'));
var useWindowSize = _interopDefault(require('react-use/lib/useWindowSize'));
require('tslib');
var helpers = require('./helpers.js');
var usePrevious = _interopDefault(require('react-use/lib/usePrevious'));

var ControlledActivated = function (_a) {
    var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom Image' : _b, isActiveFromParent = _a.isActive, onLoad = _a.onLoad, onUnload = _a.onUnload, onZoomChange = _a.onZoomChange, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, parentRef = _a.parentRef, _e = _a.portalEl, portalEl = _e === void 0 ? document.body : _e, _f = _a.scrollableEl, scrollableEl = _f === void 0 ? window : _f, _g = _a.transitionDuration, transitionDuration = _g === void 0 ? 300 : _g, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
    var btnRef = React.useRef(null);
    var _k = React.useState(0), forceUpdate = _k[1];
    var _l = React.useState(isActiveFromParent), isActive = _l[0], setIsActive = _l[1];
    var _m = React.useState(false), isLoaded = _m[0], setIsLoaded = _m[1];
    var _o = React.useState(false), isUnloading = _o[0], setIsUnloading = _o[1];
    var prevIsActive = usePrevious(isActive);
    var prevIsActiveFromParent = usePrevious(isActiveFromParent);
    var prevIsLoaded = usePrevious(isLoaded);
    var _p = useWindowSize(), innerWidth = _p.width, innerHeight = _p.height;
    // on click, tell caller it should zoom
    var handleClick = React.useCallback(function (e) {
        e.preventDefault();
        if (onZoomChange) {
            onZoomChange(false);
        }
    }, [onZoomChange]);
    // on escape, tell caller it should unzoom
    var handleKeyDown = React.useCallback(function (e) {
        if (isActive && (e.key === 'Escape' || e.keyCode === 27)) {
            e.stopPropagation();
            if (onZoomChange) {
                onZoomChange(false);
            }
        }
    }, [isActive, onZoomChange]);
    var handleScroll = React.useCallback(function () {
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
    React.useEffect(function () {
        if (!prevIsActive && isActive) {
            setIsLoaded(true);
            if (btnRef.current) {
                btnRef.current.focus({ preventScroll: true });
            }
        }
    }, [isActive, prevIsActive]);
    React.useEffect(function () {
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
    React.useEffect(function () {
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
    React.useEffect(function () {
        if (!prevIsLoaded && isLoaded) {
            onLoad();
        }
        if (prevIsLoaded && !isLoaded) {
            onUnload();
        }
    }, [isLoaded, onLoad, onUnload, prevIsLoaded]);
    // use parent element or fake one if it's not yet loaded
    var parentEl = parentRef.current || helpers.pseudoParentEl;
    // get parent element's dimensions
    var _q = parentEl.getBoundingClientRect(), height = _q.height, left = _q.left, top = _q.top, width = _q.width;
    var overlayStyle = helpers.getModalOverlayStyle({
        isLoaded: isLoaded,
        isUnloading: isUnloading,
        overlayBgColorEnd: overlayBgColorEnd,
        overlayBgColorStart: overlayBgColorStart,
        transitionDuration: transitionDuration,
        zoomZindex: zoomZindex
    });
    var contentStyle = helpers.getModalContentStyle({
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
        ? reactDom.createPortal(React__default.createElement("div", { "aria-modal": true, "data-rmiz-overlay": true, role: "dialog", style: overlayStyle },
            React__default.createElement("div", { "data-rmiz-modal-content": true, style: contentStyle }, children),
            React__default.createElement("button", { "aria-label": closeText, "data-rmiz-btn-close": true, onClick: handleClick, ref: btnRef, type: "button" })), portalEl)
        : null;
};
var ControlledActivated$1 = React.memo(ControlledActivated);

var Controlled = function (_a) {
    var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom image' : _b, isActive = _a.isZoomed, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, portalEl = _a.portalEl, onZoomChange = _a.onZoomChange, _e = _a.openText, openText = _e === void 0 ? 'Zoom image' : _e, scrollableEl = _a.scrollableEl, _f = _a.transitionDuration, transitionDuration = _f === void 0 ? 300 : _f, _g = _a.wrapElement, WrapElement = _g === void 0 ? 'div' : _g, wrapStyle = _a.wrapStyle, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
    var _k = React.useState(false), isChildLoaded = _k[0], setIsChildLoaded = _k[1];
    var wrapRef = React.useRef(null);
    var btnRef = React.useRef(null);
    var handleClickTrigger = React.useCallback(function (e) {
        if (!isActive && onZoomChange) {
            e.preventDefault();
            onZoomChange(true);
        }
    }, [isActive, onZoomChange]);
    var handleChildLoad = React.useCallback(function () {
        setIsChildLoaded(true);
    }, []);
    var handleChildUnload = React.useCallback(function () {
        setIsChildLoaded(false);
        if (btnRef.current) {
            btnRef.current.focus({ preventScroll: true });
        }
    }, []);
    var wrapType = isChildLoaded ? 'hidden' : 'visible';
    return (React__default.createElement(React.StrictMode, null,
        React__default.createElement(WrapElement, { "data-rmiz-wrap": wrapType, ref: wrapRef, style: wrapStyle },
            children,
            React__default.createElement("button", { "aria-label": openText, "data-rmiz-btn-open": true, onClick: handleClickTrigger, ref: btnRef, type: "button" }),
            typeof window !== 'undefined' && (React__default.createElement(ControlledActivated$1, { closeText: closeText, isActive: isActive, onLoad: handleChildLoad, onUnload: handleChildUnload, onZoomChange: onZoomChange, overlayBgColorEnd: overlayBgColorEnd, overlayBgColorStart: overlayBgColorStart, parentRef: wrapRef, portalEl: portalEl, scrollableEl: scrollableEl, transitionDuration: transitionDuration, zoomMargin: zoomMargin, zoomZindex: zoomZindex }, children)))));
};
var Controlled$1 = React.memo(Controlled);

exports.default = Controlled$1;

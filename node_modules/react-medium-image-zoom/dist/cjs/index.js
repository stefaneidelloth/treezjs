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
require('react-use/lib/usePrevious');
var Controlled = require('./Controlled.js');

var UncontrolledActivated = function (_a) {
    var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom Image' : _b, onUnload = _a.onUnload, onLoad = _a.onLoad, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, parentRef = _a.parentRef, _e = _a.portalEl, portalEl = _e === void 0 ? document.body : _e, _f = _a.scrollableEl, scrollableEl = _f === void 0 ? window : _f, _g = _a.transitionDuration, transitionDuration = _g === void 0 ? 300 : _g, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
    var btnRef = React.useRef(null);
    var _k = React.useState(0), forceUpdate = _k[1];
    var _l = React.useState(false), isLoaded = _l[0], setIsLoaded = _l[1];
    var _m = React.useState(false), isUnloading = _m[0], setIsUnloading = _m[1];
    var _o = useWindowSize(), innerWidth = _o.width, innerHeight = _o.height;
    // on click, begin unloading
    var handleClick = React.useCallback(function (e) {
        e.preventDefault();
        setIsUnloading(true);
    }, []);
    // on escape, begin unloading
    var handleKeyDown = React.useCallback(function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            e.stopPropagation();
            setIsUnloading(true);
        }
    }, []);
    var handleScroll = React.useCallback(function () {
        forceUpdate(function (n) { return n + 1; });
        if (!isUnloading) {
            setIsUnloading(true);
        }
    }, [isUnloading]);
    // listen for keydown on the document
    useEvent('keydown', handleKeyDown, document);
    // listen for scroll and close
    useEvent('scroll', handleScroll, scrollableEl);
    // set loaded on mount and focus
    React.useEffect(function () {
        setIsLoaded(true);
        onLoad();
        if (btnRef.current) {
            btnRef.current.focus({ preventScroll: true });
        }
    }, [onLoad]);
    // if unloading, tell parent that we're all done here after Nms
    React.useEffect(function () {
        var unloadTimeout = isUnloading
            ? setTimeout(onUnload, transitionDuration)
            : null;
        return function () {
            if (unloadTimeout) {
                clearTimeout(unloadTimeout);
            }
        };
    }, [isUnloading, onUnload, transitionDuration]);
    // use parent element or fake one if it's not yet loaded
    var parentEl = parentRef.current || helpers.pseudoParentEl;
    // get parent item's dimensions
    var _p = parentEl.getBoundingClientRect(), height = _p.height, left = _p.left, top = _p.top, width = _p.width;
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
    return reactDom.createPortal(React__default.createElement("div", { "aria-modal": true, "data-rmiz-overlay": true, role: "dialog", style: overlayStyle },
        React__default.createElement("div", { "data-rmiz-modal-content": true, style: contentStyle }, children),
        React__default.createElement("button", { "aria-label": closeText, "data-rmiz-btn-close": true, onClick: handleClick, ref: btnRef })), portalEl);
};
var UncontrolledActivated$1 = React.memo(UncontrolledActivated);

var Uncontrolled = function (_a) {
    var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom image' : _b, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, portalEl = _a.portalEl, _e = _a.openText, openText = _e === void 0 ? 'Zoom image' : _e, scrollableEl = _a.scrollableEl, _f = _a.transitionDuration, transitionDuration = _f === void 0 ? 300 : _f, _g = _a.wrapElement, WrapElement = _g === void 0 ? 'div' : _g, wrapStyle = _a.wrapStyle, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
    var _k = React.useState(false), isActive = _k[0], setIsActive = _k[1];
    var _l = React.useState(false), isChildLoaded = _l[0], setIsChildLoaded = _l[1];
    var wrapRef = React.useRef(null);
    var btnRef = React.useRef(null);
    var handleClickTrigger = React.useCallback(function (e) {
        if (!isActive) {
            e.preventDefault();
            setIsActive(true);
        }
    }, [isActive]);
    var handleChildLoad = React.useCallback(function () {
        setIsChildLoaded(true);
    }, []);
    var handleChildUnload = React.useCallback(function () {
        setIsActive(false);
        setIsChildLoaded(false);
        if (btnRef.current) {
            btnRef.current.focus({ preventScroll: true });
        }
    }, []);
    var isExpanded = isActive && isChildLoaded;
    var wrapType = isExpanded ? 'hidden' : 'visible';
    return (React__default.createElement(React.StrictMode, null,
        React__default.createElement(WrapElement, { "data-rmiz-wrap": wrapType, ref: wrapRef, style: wrapStyle },
            children,
            React__default.createElement("button", { "aria-label": openText, "data-rmiz-btn-open": true, onClick: handleClickTrigger, ref: btnRef }),
            typeof window !== 'undefined' && isActive && (React__default.createElement(UncontrolledActivated$1, { closeText: closeText, onLoad: handleChildLoad, onUnload: handleChildUnload, overlayBgColorEnd: overlayBgColorEnd, overlayBgColorStart: overlayBgColorStart, parentRef: wrapRef, portalEl: portalEl, scrollableEl: scrollableEl, transitionDuration: transitionDuration, zoomMargin: zoomMargin, zoomZindex: zoomZindex }, children)))));
};
var Uncontrolled$1 = React.memo(Uncontrolled);

exports.Controlled = Controlled.default;
exports.default = Uncontrolled$1;

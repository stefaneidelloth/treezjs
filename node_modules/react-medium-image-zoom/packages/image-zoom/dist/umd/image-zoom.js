(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['iz-umd'] = {}));
}(this, (function (exports) { 'use strict';

    var addEventListener = function (type, cb, el, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        el.addEventListener(type, cb, useCapture);
    };

    var appendChild = function (child, parent) {
        return parent.appendChild(child);
    };

    var createElement = function (type) {
        return document.createElement(type);
    };

    var focus = function (opts, el) {
        if (opts === void 0) { opts = { preventScroll: false }; }
        el === null || el === void 0 ? void 0 : el.focus(opts);
    };

    var getBoundingClientRect = function (el) {
        if (el) {
            return el.getBoundingClientRect();
        }
        return {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
            x: 0,
            y: 0,
        };
    };

    var getNextSibling = function (el) { return el.nextSibling; };

    var getPreviousSibling = function (el) { return el.previousSibling; };

    var getWindowInnerHeight = function () {
        return window.innerHeight;
    };

    var getWindowInnerWidth = function () {
        return window.innerWidth;
    };

    var getScaleToWindow = function (width, height, offset) {
        var scaleX = getWindowInnerWidth() / (width + offset);
        var scaleY = getWindowInnerHeight() / (height + offset);
        return Math.min(scaleX, scaleY);
    };

    var getScaleToWindowMax = function (width, naturalWidth, height, naturalHeight, offset) {
        var scale = getScaleToWindow(naturalWidth, naturalHeight, offset);
        var ratio = naturalWidth > naturalHeight ? naturalWidth / width : naturalHeight / height;
        return scale > 1 ? ratio : scale * ratio;
    };

    var getStyle = function (el) { return el.style; };

    var getStyleProperty = function (attr, el) {
        // any type because of https://github.com/Microsoft/TypeScript/issues/17827
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return getStyle(el)[attr];
    };

    var getWindowPageXOffset = function () {
        return window.pageXOffset;
    };

    var getWindowPageYOffset = function () {
        return window.pageYOffset;
    };

    var insertAdjacentElement = function (targetEl, position, el) {
        targetEl.insertAdjacentElement(position, el);
    };

    var isEscapeKey = function (e) { return e.key === 'Escape' || e.keyCode === 27; };

    var raf = function (cb) { return window.requestAnimationFrame(cb); };

    var removeChild = function (child, parent) {
        if (parent.contains(child)) {
            parent.removeChild(child);
        }
    };

    var removeEventListener = function (type, handler, el, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        el.removeEventListener(type, handler, useCapture);
    };

    var setAttribute = function (attr, value, el) {
        return el.setAttribute(attr, value);
    };

    var setInnerHTML = function (el, html) {
        el.innerHTML = html;
    };

    var setInnerText = function (el, text) {
        el.innerText = text;
    };

    var setStyleProperty = function (priority, propertyName, value, el) {
        el.style.setProperty(propertyName, value, priority);
    };

    var setTimeout = function (cb, delay) {
        return window.setTimeout(cb, delay);
    };

    var stopPropagation = function (e) {
        e.stopPropagation();
    };

    //import 'focus-options-polyfill' @TODO: ADD NOTE IN README TO INCLUDE IF YOU
    var States;
    (function (States) {
        States["UNZOOMED"] = "UNZOOMED";
        States["UNZOOMING"] = "UNZOOMING";
        States["ZOOMED"] = "ZOOMED";
        States["ZOOMING"] = "ZOOMING";
    })(States || (States = {}));
    var Actions;
    (function (Actions) {
        Actions["UNZOOM"] = "UNZOOM";
        Actions["ZOOM"] = "ZOOM";
    })(Actions || (Actions = {}));
    var UNZOOMED = States.UNZOOMED, UNZOOMING = States.UNZOOMING, ZOOMED = States.ZOOMED, ZOOMING = States.ZOOMING;
    var UNZOOM = Actions.UNZOOM, ZOOM = Actions.ZOOM;
    var imageZoom = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.auto, auto = _c === void 0 ? true : _c, _d = _b.margin, margin = _d === void 0 ? 0 : _d, _e = _b.onChange, onChange = _e === void 0 ? undefined : _e, _f = _b.overlayBgColor, overlayBgColor = _f === void 0 ? '#fff' : _f, _g = _b.overlayOpacity, overlayOpacity = _g === void 0 ? 1 : _g, _h = _b.transitionDuration, transitionDuration = _h === void 0 ? 300 : _h, _j = _b.unzoomLabel, unzoomLabel = _j === void 0 ? 'Unzoom image' : _j, _k = _b.zIndex, zIndex = _k === void 0 ? 2147483647 : _k, _l = _b.zoomLabel, zoomLabel = _l === void 0 ? 'Zoom image' : _l, _m = _b.zoomTitle, zoomTitle = _m === void 0 ? 'Zoomed item' : _m;
        var documentBody = document.body;
        var win = window;
        var modalBoundaryStartEl;
        var modalBoundaryStopEl;
        var modalContainerEl;
        var modalDialogEl;
        var modalDialogUnzoomBtnEl;
        var modalDialogImgEl;
        var modalDialogLabelEl;
        var modalOverlayEl;
        var state = UNZOOMED;
        var trackedEls = [];
        var attach = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!args.length)
                return;
            var setup = function (el) {
                if (el instanceof HTMLImageElement || el instanceof SVGElement) {
                    setStyleProp(CURSOR, 'pointer', el);
                    setStyleProp(CURSOR, 'zoom-in', el);
                    // init zoom button
                    var zoomBtnEl = createElement(BUTTON);
                    setAttribute(ARIA_LABEL, zoomLabel, zoomBtnEl);
                    setAttribute(DATA_RMIZ_ZOOM_BTN, '', zoomBtnEl);
                    setAttribute(STYLE, styleZoomBtnHidden, zoomBtnEl);
                    setAttribute(TYPE, BUTTON, zoomBtnEl);
                    setInnerHTML(zoomBtnEl, ZOOM_BTN_SVG);
                    // insert zoom button after img
                    insertAdjacentElement(el, 'afterend', zoomBtnEl);
                    if (auto) {
                        addEventListener(CLICK, handleImgClick, el);
                        addEventListener(CLICK, handleZoomBtnClick, zoomBtnEl);
                        addEventListener(FOCUS, handleZoomBtnFocus, zoomBtnEl);
                        addEventListener(BLUR, handleZoomBtnBlur, zoomBtnEl);
                        trackedEls.push(el);
                    }
                }
            };
            for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
                var arg = args_1[_a];
                if (arg instanceof NodeList || arg instanceof Array) {
                    for (var _b = 0, _c = arg; _b < _c.length; _b++) {
                        var item = _c[_b];
                        setup(item);
                    }
                }
                else {
                    setup(arg);
                }
            }
        };
        var detach = function (el, skipTracking) {
            if (skipTracking === void 0) { skipTracking = false; }
            if (!skipTracking) {
                trackedEls = trackedEls.filter(function (x) { return x !== el; });
            }
            if (el) {
                setStyleProp(CURSOR, '', el);
            }
            if (auto) {
                if (el) {
                    removeEventListener(CLICK, handleImgClick, el);
                    var zoomBtnEl = getNextSibling(el);
                    if (zoomBtnEl instanceof HTMLButtonElement) {
                        removeEventListener(FOCUS, handleZoomBtnFocus, zoomBtnEl);
                        removeEventListener(BLUR, handleZoomBtnBlur, zoomBtnEl);
                    }
                }
            }
        };
        var dispatch = function (_a) {
            var type = _a.type, value = _a.value;
            if (onChange) {
                onChange({ type: type, value: value });
            }
        };
        var reset = function () {
            teardown();
            setup();
        };
        var setState = function (nextState) {
            state = nextState;
            dispatch({ type: STATE, value: state });
        };
        var setup = function () {
            // setup modal container
            modalContainerEl = createElement(DIV);
            setAttribute(DATA_RMIZ_CONTAINER, '', modalContainerEl);
            setStyleProp('zIndex', "" + zIndex, modalContainerEl);
            // setup modal overlay
            modalOverlayEl = createElement(DIV);
            setAttribute(DATA_RMIZ_OVERLAY, '', modalOverlayEl);
            setAttribute(STYLE, 'position:fixed;top:0;right:0;bottom:0;left:0;' +
                ("background-color:" + overlayBgColor + ";") +
                ("transition-duration:" + transitionDuration + "ms;") +
                'transition-property:opacity;opacity:0;will-change:opacity;' +
                styleCursorZoomOut, modalOverlayEl);
            // setup modal boundary start
            modalBoundaryStartEl = createElement(DIV);
            setAttribute(TABINDEX, ZERO_STR, modalBoundaryStartEl);
            // setup modal boundary stop
            modalBoundaryStopEl = createElement(DIV);
            setAttribute(TABINDEX, ZERO_STR, modalBoundaryStopEl);
            // setup dialog
            modalDialogEl = createElement(DIV);
            setAttribute(ARIA_LABELLED_BY, ID_RMIZ_MODAL_LABEL, modalDialogEl);
            setAttribute(ARIA_MODAL, 'true', modalDialogEl);
            setAttribute(DATA_RMIZ_DIALOG, '', modalDialogEl);
            setAttribute(ROLE, DIALOG, modalDialogEl);
            setAttribute(TABINDEX, ZERO_STR, modalDialogEl);
            // setup dialog close button
            modalDialogUnzoomBtnEl = createElement(BUTTON);
            // setup dialog label
            modalDialogLabelEl = createElement(DIV);
            setAttribute(STYLE, styleVisuallyHidden, modalDialogLabelEl);
            setAttribute(ID, ID_RMIZ_MODAL_LABEL, modalDialogLabelEl);
            setInnerText(modalDialogLabelEl, zoomTitle);
            // add label & close button to dialog
            appendChild(modalDialogUnzoomBtnEl, modalDialogEl);
            appendChild(modalDialogLabelEl, modalDialogEl);
            //appendChild(modalDialogImgEl, modalDialogEl)
            // add items to container
            appendChild(modalOverlayEl, modalContainerEl);
            appendChild(modalBoundaryStartEl, modalContainerEl);
            appendChild(modalDialogEl, modalContainerEl);
            appendChild(modalBoundaryStopEl, modalContainerEl);
        };
        var teardown = function () {
            // detach all automatically tracked elements
            for (var _i = 0, trackedEls_1 = trackedEls; _i < trackedEls_1.length; _i++) {
                var trackedEl = trackedEls_1[_i];
                detach(trackedEl, true);
            }
            // cleanup zoom bits
            teardownZoom();
            // cleanup variables
            modalBoundaryStartEl = undefined;
            modalBoundaryStopEl = undefined;
            modalContainerEl = undefined;
            modalDialogUnzoomBtnEl = undefined;
            modalDialogEl = undefined;
            modalDialogLabelEl = undefined;
            modalOverlayEl = undefined;
            trackedEls = [];
            // update state to unzoomed
            setState(UNZOOMED);
        };
        var teardownZoom = function () {
            // cleanup window resize listener
            removeEventListener(RESIZE, handleResize, win);
            // cleanup modal click
            if (modalContainerEl) {
                removeEventListener(CLICK, handleModalClick, modalContainerEl);
            }
            // cleanup listener on boundary start el
            if (modalBoundaryStartEl) {
                removeEventListener(FOCUS, handleFocusBoundaryDiv, modalBoundaryStartEl);
            }
            // cleanup listener on boundary stop el
            if (modalBoundaryStopEl) {
                removeEventListener(FOCUS, handleFocusBoundaryDiv, modalBoundaryStopEl);
            }
            if (modalContainerEl) {
                removeChild(modalContainerEl, documentBody);
            }
        };
        // update the instance's options
        var update = function (opts) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            if (opts === void 0) { opts = {}; }
            auto = (_a = opts.auto) !== null && _a !== void 0 ? _a : auto;
            margin = (_b = opts.margin) !== null && _b !== void 0 ? _b : margin;
            onChange = (_c = opts.onChange) !== null && _c !== void 0 ? _c : onChange;
            overlayBgColor = (_d = opts.overlayBgColor) !== null && _d !== void 0 ? _d : overlayBgColor;
            overlayOpacity = (_e = opts.overlayOpacity) !== null && _e !== void 0 ? _e : overlayOpacity;
            transitionDuration = (_f = opts.transitionDuration) !== null && _f !== void 0 ? _f : transitionDuration;
            unzoomLabel = (_g = opts.unzoomLabel) !== null && _g !== void 0 ? _g : unzoomLabel;
            zIndex = (_h = opts.zIndex) !== null && _h !== void 0 ? _h : zIndex;
            zoomLabel = (_j = opts.zoomLabel) !== null && _j !== void 0 ? _j : zoomLabel;
            zoomTitle = (_k = opts.zoomTitle) !== null && _k !== void 0 ? _k : zoomTitle;
            if (modalContainerEl) {
                setStyleProp('zIndex', "" + zIndex, modalContainerEl);
            }
            if (modalOverlayEl) {
                if (isNotNil(opts.overlayBgColor)) {
                    setStyleProp(BG_COLOR, overlayBgColor, modalOverlayEl);
                }
                if (isNotNil(opts.overlayOpacity)) {
                    setStyleProp(OPACITY, "" + overlayOpacity, modalOverlayEl);
                }
                if (isNotNil(opts.transitionDuration)) {
                    setStyleProp(TRANSITION_DURATION, "" + transitionDuration, modalOverlayEl);
                }
            }
            if (modalDialogLabelEl) {
                modalDialogLabelEl.innerText = zoomTitle;
            }
            if (modalDialogUnzoomBtnEl) {
                modalDialogUnzoomBtnEl.innerText = unzoomLabel;
            }
        };
        var unzoom = function () {
            setState(UNZOOMING);
            teardownZoom();
            setState(UNZOOMED);
        };
        var zoom = function (el) {
            if (el instanceof HTMLImageElement) {
                setState(ZOOMING);
                var _a = getBoundingClientRect(el), height = _a.height, left = _a.left, top_1 = _a.top, width = _a.width;
                var naturalHeight = el.naturalHeight, naturalWidth = el.naturalWidth;
                var oldTransform = getStyleProperty(TRANSFORM, el);
                var oldTransformVal = oldTransform ? " " + oldTransform : '';
                var scale = getScaleToWindowMax(width, naturalWidth, height, naturalHeight, margin);
                var topOffset = getWindowPageYOffset();
                var leftOffset = getWindowPageXOffset();
                // Get the coords for center of the parent item
                //const childCenterX = left + width / 2
                //const childCenterY = top + height / 2
                // Get offset amounts for item coords to be centered on screen
                var translateX = -left; //(viewportX - childCenterX) / scale
                var translateY = 0; //(viewportY - childCenterY) / scale
                // Build transform style, including any old transform
                var zoomTransform_1 = "scale(1) translate3d(" + translateX + "px," + translateY + "px,0)" +
                    oldTransformVal;
                console.log({
                    height: height,
                    left: left,
                    top: top_1,
                    width: width,
                    naturalWidth: naturalWidth,
                    naturalHeight: naturalHeight,
                    scale: scale,
                });
                // clone image and set up
                modalDialogImgEl = createElement(IMG);
                setAttribute(ALT, el.alt, modalDialogImgEl);
                setAttribute(SRC, el.currentSrc, modalDialogImgEl);
                setAttribute(DATA_RMIZ_DIALOG_IMG, '', modalDialogImgEl);
                if (!modalContainerEl || !modalDialogEl || !modalDialogImgEl) {
                    return;
                }
                setAttribute(STYLE, stylePositionAbsolute +
                    ("top:" + (topOffset + top_1) + "px;") +
                    ("left:" + (leftOffset + left) + "px;") +
                    ("height:" + height * scale + "px;") +
                    ("width:" + width * scale + "px;") +
                    ("transform:scale(" + 1 / scale + ") translate3d(0,0,0)") + oldTransformVal + ';' +
                    ("transition:transform " + transitionDuration + "ms cubic-bezier(0.2,0,0.2,1);") +
                    'transform-origin:top left;' +
                    styleCursorZoomOut, modalDialogImgEl);
                // add image to modal dialog
                appendChild(modalDialogImgEl, modalDialogEl);
                // append modal container to DOM
                appendChild(modalContainerEl, documentBody);
                // listen for window resize
                addEventListener(RESIZE, handleResize, win);
                // listen for keydown
                addEventListener(KEYDOWN, handleDocumentKeyDown, document);
                // listen for modal click
                if (modalContainerEl) {
                    addEventListener(CLICK, handleModalClick, modalContainerEl);
                }
                // listen for focus on the modal boundary start
                if (modalBoundaryStartEl) {
                    addEventListener(FOCUS, handleFocusBoundaryDiv, modalBoundaryStartEl);
                }
                // listen for focus on the modal boundary stop
                if (modalBoundaryStopEl) {
                    addEventListener(FOCUS, handleFocusBoundaryDiv, modalBoundaryStopEl);
                }
                //raf(() => {
                //  setTimeout(() => {
                //    if (modalOverlayEl) {
                //      // reveal overlay
                //      setStyleProp(OPACITY, '1', modalOverlayEl)
                //    }
                //  }, 0)
                //})
                raf(function () {
                    setTimeout(function () {
                        if (el && modalDialogImgEl) {
                            // hide original image
                            //setStyleProp(VISIBILITY, HIDDEN, el)
                            // perform zoom transform
                            setStyleProp(TRANSFORM, zoomTransform_1, modalDialogImgEl);
                            // @TODO: on animationend
                            setState(ZOOMED);
                        }
                    }, 0);
                });
            }
            if (el instanceof SVGElement) {
                console.log('GOT AN SVG HERE!');
            }
        };
        var handleDocumentKeyDown = function (e) {
            if (isEscapeKey(e)) {
                stopPropagation(e);
                dispatch({ type: ACTION, value: UNZOOM });
                if (auto) {
                    unzoom();
                }
            }
        };
        var handleFocusBoundaryDiv = function () {
            focusPreventScroll(modalDialogUnzoomBtnEl);
        };
        var handleImgClick = function (e) {
            dispatch({ type: ACTION, value: ZOOM });
            if (auto) {
                zoom(e.currentTarget);
            }
        };
        var handleModalClick = function () {
            console.log('MODAL CLICKED!');
            dispatch({ type: ACTION, value: UNZOOM });
            if (auto) {
                unzoom();
            }
        };
        var handleResize = function () {
            if (state === ZOOMED) {
                dispatch({ type: ACTION, value: UNZOOM });
                if (auto) {
                    unzoom();
                }
            }
        };
        var handleZoomBtnBlur = function (e) {
            setAttribute(STYLE, styleZoomBtnHidden, e.currentTarget);
        };
        var handleZoomBtnFocus = function (e) {
            setAttribute(STYLE, styleAppearanceNone +
                styleCursorZoomIn +
                stylePositionAbsolute +
                'padding:3px;' +
                'width:30px;' +
                'height:30px;' +
                'background:#fff;' +
                'border:none;' +
                'fill:#707070;' +
                'transform:translateX(-100%);', e.currentTarget);
        };
        var handleZoomBtnClick = function (e) {
            var zoomBtnEl = e.currentTarget;
            var imgEl = getPreviousSibling(zoomBtnEl);
            if (imgEl instanceof HTMLImageElement) {
                dispatch({ type: ACTION, value: ZOOM });
                if (auto) {
                    zoom(imgEl);
                }
            }
        };
        setup();
        return {
            attach: attach,
            detach: detach,
            reset: reset,
            teardown: teardown,
            unzoom: unzoom,
            update: update,
            zoom: zoom,
        };
    };
    // HELPERS
    var focusPreventScroll = focus.bind(null, { preventScroll: true });
    var isNotNil = function (x) { return x != null; };
    var setStyleProp = setStyleProperty.bind(null, undefined);
    //
    // STRINGS
    //
    var PREFIX = 'rmiz';
    var DATA_PREFIX = "data-" + PREFIX;
    var ACTION = 'ACTION';
    var ALT = 'alt';
    var ARIA_LABEL = 'aria-label';
    var ARIA_LABELLED_BY = 'aria-labelledby';
    var ARIA_MODAL = 'aria-modal';
    var BG_COLOR = 'background-color';
    var BLUR = 'blur';
    var BUTTON = 'button';
    var CLICK = 'click';
    var CURSOR = 'cursor';
    var DATA_RMIZ_CONTAINER = DATA_PREFIX + "-container";
    var DATA_RMIZ_DIALOG = DATA_PREFIX + "-dialog";
    var DATA_RMIZ_DIALOG_IMG = DATA_PREFIX + "-dialog-img";
    var DATA_RMIZ_OVERLAY = DATA_PREFIX + "-overlay";
    var DATA_RMIZ_ZOOM_BTN = DATA_PREFIX + "-zoom-button";
    var DIALOG = 'dialog';
    var DIV = 'div';
    var FOCUS = 'focus';
    var ID = 'id';
    var ID_RMIZ_MODAL_LABEL = PREFIX + "-modal-label";
    var IMG = 'img';
    var KEYDOWN = 'keydown';
    var OPACITY = 'opacity';
    var RESIZE = 'resize';
    var ROLE = 'role';
    var SRC = 'src';
    var STATE = 'STATE';
    var STYLE = 'style';
    var TABINDEX = 'tabindex';
    var TRANSFORM = 'transform';
    var TRANSITION_DURATION = 'transition-duration';
    var TYPE = 'type';
    var ZERO_STR = '0';
    var ZOOM_BTN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 489.3 489.3"><path d="M476.95 0H12.35C5.55 0 .15 5.5.15 12.2V235c0 6.8 5.5 12.2 12.2 12.2s12.3-5.5 12.3-12.2V24.5h440.2v440.2h-211.9c-6.8 0-12.3 5.5-12.3 12.3s5.5 12.3 12.3 12.3h224c6.8 0 12.3-5.5 12.3-12.3V12.3c0-6.8-5.5-12.3-12.3-12.3z"/><path d="M.05 476.9c0 6.8 5.5 12.3 12.2 12.3h170.4c6.8 0 12.3-5.5 12.3-12.3V306.6c0-6.8-5.5-12.3-12.3-12.3H12.35c-6.8 0-12.2 5.5-12.2 12.3v170.3h-.1zm24.5-158.1h145.9v145.9H24.55V318.8zM222.95 266.3c2.4 2.4 5.5 3.6 8.7 3.6s6.3-1.2 8.7-3.6l138.6-138.7v79.9c0 6.8 5.5 12.3 12.3 12.3s12.3-5.5 12.3-12.3V98.1c0-6.8-5.5-12.3-12.3-12.3h-109.5c-6.8 0-12.3 5.5-12.3 12.3s5.5 12.3 12.3 12.3h79.9L222.95 249c-4.8 4.8-4.8 12.5 0 17.3z"/></svg>';
    //
    // STYLING
    //
    var styleAppearanceNone = '-webkit-appearance:none;-moz-appearance:none;appearance:none;';
    var styleCursorPointer = 'cursor:pointer;';
    var styleCursorZoomIn = styleCursorPointer + "cursor:zoom-in;";
    var styleCursorZoomOut = styleCursorPointer + "cursor:zoom-out;";
    //const styleFastTap = 'touch-action:manipulation;'
    var stylePositionAbsolute = 'position:absolute;';
    //const styleVisibilityHidden = 'visibility:hidden;'
    var styleVisuallyHidden = stylePositionAbsolute + 'clip:rect(0 0 0 0);clip-path:inset(50%);width:1px;height:1px;overflow:hidden;white-space:nowrap;';
    var styleZoomBtnHidden = styleCursorZoomIn +
        stylePositionAbsolute +
        styleVisuallyHidden;

    exports.default = imageZoom;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

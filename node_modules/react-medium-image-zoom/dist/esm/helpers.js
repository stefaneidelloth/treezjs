import { __spreadArrays } from 'tslib';

var toDurationString = function (duration) { return duration + "ms"; };
var getScale = function (_a) {
    var height = _a.height, innerHeight = _a.innerHeight, innerWidth = _a.innerWidth, width = _a.width, zoomMargin = _a.zoomMargin;
    var scaleX = innerWidth / (width + zoomMargin);
    var scaleY = innerHeight / (height + zoomMargin);
    var scale = Math.min(scaleX, scaleY);
    return scale;
};
var getModalContentStyle = function (_a) {
    var height = _a.height, innerHeight = _a.innerHeight, innerWidth = _a.innerWidth, isLoaded = _a.isLoaded, isUnloading = _a.isUnloading, left = _a.left, originalTransform = _a.originalTransform, top = _a.top, transitionDuration = _a.transitionDuration, width = _a.width, zoomMargin = _a.zoomMargin;
    var transitionDurationString = toDurationString(transitionDuration);
    if (!isLoaded || isUnloading) {
        var initTransform = __spreadArrays([
            "scale(1)",
            "translate(0, 0)"
        ], (originalTransform ? [originalTransform] : [])).join(' ');
        return {
            height: height,
            left: left,
            top: top,
            transform: initTransform,
            WebkitTransform: initTransform,
            transitionDuration: transitionDurationString,
            width: width
        };
    }
    // Get amount to scale item
    var scale = getScale({
        height: height,
        innerWidth: innerWidth,
        innerHeight: innerHeight,
        width: width,
        zoomMargin: zoomMargin
    });
    // Get the the coords for center of the viewport
    var viewportX = innerWidth / 2;
    var viewportY = innerHeight / 2;
    // Get the coords for center of the parent item
    var childCenterX = left + width / 2;
    var childCenterY = top + height / 2;
    // Get offset amounts for item coords to be centered on screen
    var translateX = (viewportX - childCenterX) / scale;
    var translateY = (viewportY - childCenterY) / scale;
    // Build transform style, including any original transform
    var transform = __spreadArrays([
        "scale(" + scale + ")",
        "translate(" + translateX + "px, " + translateY + "px)"
    ], (originalTransform ? [originalTransform] : [])).join(' ');
    return {
        height: height,
        left: left,
        top: top,
        transform: transform,
        WebkitTransform: transform,
        transitionDuration: transitionDurationString,
        width: width
    };
};
var getModalOverlayStyle = function (_a) {
    var isLoaded = _a.isLoaded, isUnloading = _a.isUnloading, overlayBgColorEnd = _a.overlayBgColorEnd, overlayBgColorStart = _a.overlayBgColorStart, transitionDuration = _a.transitionDuration, zoomZindex = _a.zoomZindex;
    var style = {
        backgroundColor: overlayBgColorStart,
        transitionDuration: toDurationString(transitionDuration),
        zIndex: zoomZindex
    };
    if (isLoaded && !isUnloading) {
        style.backgroundColor = overlayBgColorEnd;
    }
    return style;
};
var pseudoParentEl = {
    getBoundingClientRect: function () { return ({
        height: 0,
        left: 0,
        top: 0,
        width: 0
    }); },
    style: {
        transform: null
    }
};

export { getModalContentStyle, getModalOverlayStyle, getScale, pseudoParentEl };

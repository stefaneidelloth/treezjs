"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var image_zoom_1 = tslib_1.__importDefault(require("@rpearce/image-zoom"));
var useImageZoom = function (opts) {
    var ref = react_1.useRef(null);
    var savedOpts = react_1.useRef(opts);
    var imgZoom = react_1.useRef();
    var setup = react_1.useCallback(function () {
        var _a, _b;
        var el = ref.current;
        if (!el)
            return;
        imgZoom.current = image_zoom_1.default(savedOpts.current, el);
        if ((_a = savedOpts.current) === null || _a === void 0 ? void 0 : _a.isZoomed) {
            (_b = imgZoom.current) === null || _b === void 0 ? void 0 : _b.update(savedOpts.current);
        }
    }, []);
    var cleanup = react_1.useCallback(function () {
        var _a;
        (_a = imgZoom.current) === null || _a === void 0 ? void 0 : _a.cleanup();
        imgZoom.current = undefined;
    }, []);
    react_1.useEffect(function () {
        var _a;
        savedOpts.current = opts;
        (_a = imgZoom.current) === null || _a === void 0 ? void 0 : _a.update(savedOpts.current);
    }, [opts]);
    react_1.useEffect(function () {
        setup();
        return function () {
            cleanup();
        };
    }, [cleanup, setup]);
    react_1.useEffect(function () {
        if (ref.current) {
            if (!imgZoom.current) {
                setup();
            }
        }
        else {
            cleanup();
        }
    });
    return { ref: ref };
};
exports.default = useImageZoom;

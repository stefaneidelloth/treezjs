import { useCallback, useEffect, useRef } from 'react';
import ImageZoom from '@rpearce/image-zoom';
var useImageZoom = function (opts) {
    var ref = useRef(null);
    var savedOpts = useRef(opts);
    var imgZoom = useRef();
    var setup = useCallback(function () {
        var _a, _b;
        var el = ref.current;
        if (!el)
            return;
        imgZoom.current = ImageZoom(savedOpts.current, el);
        if ((_a = savedOpts.current) === null || _a === void 0 ? void 0 : _a.isZoomed) {
            (_b = imgZoom.current) === null || _b === void 0 ? void 0 : _b.update(savedOpts.current);
        }
    }, []);
    var cleanup = useCallback(function () {
        var _a;
        (_a = imgZoom.current) === null || _a === void 0 ? void 0 : _a.cleanup();
        imgZoom.current = undefined;
    }, []);
    useEffect(function () {
        var _a;
        savedOpts.current = opts;
        (_a = imgZoom.current) === null || _a === void 0 ? void 0 : _a.update(savedOpts.current);
    }, [opts]);
    useEffect(function () {
        setup();
        return function () {
            cleanup();
        };
    }, [cleanup, setup]);
    useEffect(function () {
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
export default useImageZoom;

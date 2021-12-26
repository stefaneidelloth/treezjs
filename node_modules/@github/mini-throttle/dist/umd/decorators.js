(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.debounce = exports.throttle = void 0;
    const index_1 = require("./index");
    function throttle(wait = 0, opts = {}) {
        return (proto, name, descriptor) => {
            if (!descriptor || typeof descriptor.value !== 'function') {
                throw new Error('debounce can only decorate functions');
            }
            const fn = descriptor.value;
            descriptor.value = index_1.throttle(fn, wait, opts);
            Object.defineProperty(proto, name, descriptor);
        };
    }
    exports.throttle = throttle;
    function debounce(wait = 0, opts = {}) {
        return (proto, name, descriptor) => {
            if (!descriptor || typeof descriptor.value !== 'function') {
                throw new Error('debounce can only decorate functions');
            }
            const fn = descriptor.value;
            descriptor.value = index_1.debounce(fn, wait, opts);
            Object.defineProperty(proto, name, descriptor);
        };
    }
    exports.debounce = debounce;
});

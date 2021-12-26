var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./useImageZoom"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImageZoom = void 0;
    var useImageZoom_1 = require("./useImageZoom");
    Object.defineProperty(exports, "useImageZoom", { enumerable: true, get: function () { return __importDefault(useImageZoom_1).default; } });
});

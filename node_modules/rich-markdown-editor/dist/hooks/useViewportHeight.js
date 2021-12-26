"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useViewportHeight() {
    const [height, setHeight] = react_1.useState(() => { var _a; return ((_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.height) || window.innerHeight; });
    react_1.useLayoutEffect(() => {
        var _a;
        const handleResize = () => {
            setHeight(() => { var _a; return ((_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.height) || window.innerHeight; });
        };
        (_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.addEventListener("resize", handleResize);
        return () => {
            var _a;
            (_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.removeEventListener("resize", handleResize);
        };
    }, []);
    return height;
}
exports.default = useViewportHeight;
//# sourceMappingURL=useViewportHeight.js.map
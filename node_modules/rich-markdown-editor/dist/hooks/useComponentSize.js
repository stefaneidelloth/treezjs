"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resize_observer_polyfill_1 = __importDefault(require("resize-observer-polyfill"));
const react_1 = require("react");
function useComponentSize(ref) {
    const [size, setSize] = react_1.useState({
        width: 0,
        height: 0,
    });
    react_1.useEffect(() => {
        const sizeObserver = new resize_observer_polyfill_1.default(entries => {
            entries.forEach(({ target }) => {
                if (size.width !== target.clientWidth ||
                    size.height !== target.clientHeight) {
                    setSize({ width: target.clientWidth, height: target.clientHeight });
                }
            });
        });
        sizeObserver.observe(ref.current);
        return () => sizeObserver.disconnect();
    }, [ref]);
    return size;
}
exports.default = useComponentSize;
//# sourceMappingURL=useComponentSize.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useMediaQuery(query) {
    const [matches, setMatches] = react_1.useState(false);
    react_1.useEffect(() => {
        if (window.matchMedia) {
            const media = window.matchMedia(query);
            if (media.matches !== matches) {
                setMatches(media.matches);
            }
            const listener = () => {
                setMatches(media.matches);
            };
            media.addListener(listener);
            return () => media.removeListener(listener);
        }
    }, [matches, query]);
    return matches;
}
exports.default = useMediaQuery;
//# sourceMappingURL=useMediaQuery.js.map
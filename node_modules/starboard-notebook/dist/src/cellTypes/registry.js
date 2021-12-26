/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { DEFAULT_CELL_TYPE_DEFINITION, DefaultCellHandler } from "./default";
import { MARKDOWN_CELL_TYPE_DEFINITION } from "./markdown";
import { JAVASCRIPT_CELL_TYPE_DEFINITION } from "./javascript/javascript";
import { HTML_CELL_TYPE_DEFINITION } from "./html";
import { CSS_CELL_TYPE_DEFINITION } from "./css";
import { MapRegistry } from "../types";
import { ES_MODULE_CELL_TYPE_DEFINITION } from "./esm/esm";
import { LATEX_CELL_TYPE_DEFINITION } from "./latex";
const PLAINTEXT_CELL_TYPE_DEFINITION = {
    name: "Plaintext",
    cellType: ["plaintext", "raw"],
    createHandler: (c, r) => new DefaultCellHandler(c, r),
};
const builtinCellTypes = [
    MARKDOWN_CELL_TYPE_DEFINITION,
    JAVASCRIPT_CELL_TYPE_DEFINITION,
    ES_MODULE_CELL_TYPE_DEFINITION,
    HTML_CELL_TYPE_DEFINITION,
    CSS_CELL_TYPE_DEFINITION,
    LATEX_CELL_TYPE_DEFINITION,
    PLAINTEXT_CELL_TYPE_DEFINITION,
];
export function getCellTypeDefinitionForCellType(cellType) {
    if (registry.has(cellType)) {
        return registry.get(cellType);
    }
    else {
        return {
            ...DEFAULT_CELL_TYPE_DEFINITION,
            cellType: cellType,
            name: `Unknown type "${cellType}"`,
        };
    }
}
export function getAvailableCellTypes() {
    return [...new Set(registry.values())];
}
// Singleton global value
export const registry = new MapRegistry();
builtinCellTypes.forEach((e) => {
    registry.set(e.cellType, e);
});
//# sourceMappingURL=registry.js.map
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* This file is internal and should never be imported externally if using starboard-notebook as a library */
import { MapRegistry } from "../types";
import { textToNotebookContent } from "../content/parsing";
import { ConsoleCatcher } from "../console/console";
import { registry as cellTypeRegistry } from "../cellTypes/registry";
import { registry as cellPropertiesRegistry } from "../cellProperties/registry";
import { addCellToNotebookContent, changeCellType, removeCellFromNotebookById, requireIndexOfCellId, } from "../content/notebookContent";
import { notebookContentToText } from "../content/serialization";
import { debounce } from "@github/mini-throttle";
import { registerDefaultPlugins, setupCommunicationWithParentFrame, setupGlobalKeybindings, updateCellsWhenCellDefinitionChanges, updateCellsWhenPropertyGetsDefined, updateIframeWhenSizeChanges, } from "./core";
import { createExports } from "./exports";
import { arrayMoveElement } from "../components/helpers/array";
import { dispatchStarboardEvent } from "../components/helpers/event";
import { initCrossOriginIsolatedServiceWorker, removeCrossOriginIsolatedServiceWorker, } from "../serviceWorker/initServiceWorker";
function getInitialContent() {
    if (window.initialNotebookContent) {
        return textToNotebookContent(window.initialNotebookContent);
    }
    const notebookContentElement = document.querySelector('script[type="application/vnd.starboard.nb"]');
    if (notebookContentElement) {
        return textToNotebookContent(notebookContentElement.innerText);
    }
    return { cells: [], metadata: {} };
}
function getConfig() {
    let config = {
        persistCellIds: false,
        defaultTextEditor: "codemirror",
    };
    if (window.runtimeConfig) {
        config = {
            ...config,
            ...window.runtimeConfig,
        };
    }
    return config;
}
function mustGetCellById(rt, id) {
    const cell = rt.dom.getCellById(id);
    if (!cell)
        throw new Error(`Cell with id ${id} not found`);
    return cell;
}
export function setupRuntime(notebook) {
    const content = getInitialContent();
    /** Runtime without any of the functions **/
    const rt = {
        consoleCatcher: new ConsoleCatcher(window.console),
        content,
        config: getConfig(),
        dom: {
            cells: [],
            notebook,
            getCellById: (id) => notebook.querySelector(`[id="${id}"]`),
        },
        definitions: {
            cellTypes: cellTypeRegistry,
            cellProperties: cellPropertiesRegistry,
        },
        name: "starboard-notebook",
        version: STARBOARD_NOTEBOOK_VERSION,
        // These are set below
        controls: null,
        exports: null,
        internal: {
            listeners: {
                cellContentChanges: new Map(),
            },
        },
        plugins: new MapRegistry(),
    };
    if (rt.config.useCrossOriginIsolationServiceWorker !== false) {
        initCrossOriginIsolatedServiceWorker();
    }
    else {
        removeCrossOriginIsolatedServiceWorker();
    }
    const controls = {
        insertCell(opts) {
            if (dispatchStarboardEvent(rt.dom.notebook, "sb:insert_cell", opts)) {
                const id = addCellToNotebookContent(rt, opts.data, opts.position, opts.adjacentCellId);
                notebook.requestUpdate();
                controls.contentChanged();
                return id;
            }
            return false;
        },
        removeCell(opts) {
            if (dispatchStarboardEvent(mustGetCellById(rt, opts.id), "sb:remove_cell", opts)) {
                removeCellFromNotebookById(rt.content, opts.id);
                notebook.requestUpdate();
                controls.contentChanged();
                return true;
            }
            return false;
        },
        moveCell(opts) {
            // Note: the actual moving happens in moveCellToIndex, that is also where the event is triggered.
            const idx = requireIndexOfCellId(rt.content.cells, opts.id);
            return controls.moveCellToIndex({ id: opts.id, toIndex: idx + opts.amount });
        },
        moveCellToIndex(opts) {
            const fromIndex = requireIndexOfCellId(rt.content.cells, opts.id);
            const maxIndex = rt.content.cells.length - 1;
            const toIndexClamped = Math.max(Math.min(opts.toIndex, Math.max(0, maxIndex)), Math.min(0, maxIndex));
            if (fromIndex === toIndexClamped)
                return true;
            if (dispatchStarboardEvent(mustGetCellById(rt, opts.id), "sb:move_cell", {
                id: opts.id,
                fromIndex: fromIndex,
                toIndex: toIndexClamped,
            })) {
                arrayMoveElement(rt.content.cells, fromIndex, toIndexClamped);
                rt.dom.notebook.moveCellDomElement(fromIndex, toIndexClamped);
                controls.contentChanged();
                return true;
            }
            return false;
        },
        changeCellType(opts) {
            const cell = mustGetCellById(rt, opts.id);
            if (dispatchStarboardEvent(cell, "sb:change_cell_type", opts)) {
                const didChange = changeCellType(rt.content, opts.id, opts.newCellType);
                cell.remove();
                notebook.requestUpdate();
                if (didChange) {
                    controls.contentChanged();
                }
                return true;
            }
            return false;
        },
        setCellProperty(opts) {
            const cell = mustGetCellById(rt, opts.id);
            if (dispatchStarboardEvent(cell, "sb:set_cell_property", opts)) {
                if (opts.value === undefined) {
                    delete cell.cell.metadata.properties[opts.property];
                }
                else {
                    cell.cell.metadata.properties[opts.property] = opts.value;
                }
                return true;
            }
            return false;
        },
        resetCell(opts) {
            const cell = mustGetCellById(rt, opts.id);
            if (dispatchStarboardEvent(cell, "sb:remove_cell", opts)) {
                cell.remove();
                notebook.requestUpdate();
                return true;
            }
            return false;
        },
        runCell(opts) {
            const cell = mustGetCellById(rt, opts.id);
            if (dispatchStarboardEvent(cell, "sb:run_cell", opts)) {
                cell.run();
                return true;
            }
            return false;
        },
        async focusCell(opts) {
            const idx = requireIndexOfCellId(rt.content.cells, opts.id);
            await rt.dom.notebook.updateComplete;
            const cellElements = rt.dom.cells;
            const cell = cellElements[idx];
            if (dispatchStarboardEvent(cell, "sb:focus_cell", opts)) {
                if (opts.focusTarget === "previous") {
                    const next = cellElements[idx - 1];
                    if (next)
                        next.focusEditor({ position: "end" });
                }
                else if (opts.focusTarget === "next") {
                    const next = cellElements[idx + 1];
                    if (next) {
                        next.focusEditor({ position: "start" });
                    }
                }
                else if (opts.focusTarget === undefined) {
                    cell.focus({});
                }
                return true;
            }
            return false;
        },
        clearCell(opts) {
            const cell = mustGetCellById(rt, opts.id);
            if (dispatchStarboardEvent(cell, "sb:clear_cell", opts)) {
                cell.clear();
                return true;
            }
            return false;
        },
        save(opts) {
            if (dispatchStarboardEvent(rt.dom.notebook, "sb:save", opts)) {
                const couldSave = controls.sendMessage({
                    type: "NOTEBOOK_SAVE_REQUEST",
                    payload: {
                        content: notebookContentToText(rt.content),
                    },
                });
                if (!couldSave) {
                    console.error("Can't save as parent frame is not listening for messages");
                }
                return true;
            }
            return false;
        },
        async runAllCells(opts = {}) {
            if (dispatchStarboardEvent(rt.dom.notebook, "sb:run_all_cells", opts)) {
                let cellElement = rt.dom.cells[0] || null;
                while (cellElement) {
                    if (opts.onlyRunOnLoad && !cellElement.cell.metadata.properties.run_on_load) {
                        // Don't run this cell..
                    }
                    else {
                        await cellElement.run();
                    }
                    cellElement = cellElement.nextSibling;
                }
                return true;
            }
            return false;
        },
        clearAllCells() {
            for (const c of rt.dom.cells) {
                this.clearCell({ id: c.id });
            }
        },
        sendMessage(message, opts = {}) {
            var _a;
            if (window.parent) {
                window.parent.postMessage(message, (_a = opts.targetOrigin) !== null && _a !== void 0 ? _a : "*");
                return true;
            }
            return false;
        },
        /**
         * To be called when the notebook content text changes in any way.
         */
        contentChanged: debounce(function () {
            controls.sendMessage({
                type: "NOTEBOOK_CONTENT_UPDATE",
                payload: {
                    content: notebookContentToText(rt.content),
                },
            });
        }, 100),
        /**
         * @deprecated use `runtime.controls` directly instead, this now emits browser events to facilitate canceling.
         * @param event
         */
        emit(event) {
            console.warn("runtime.controls.emit is DEPRECATED since 0.12.0 and will be removed in an upcoming version of Starboard! Please update your plugins.");
            if (event.type === "RUN_CELL") {
                controls.runCell(event);
            }
            else if (event.type === "INSERT_CELL") {
                controls.insertCell(event);
            }
            else if (event.type === "REMOVE_CELL") {
                controls.removeCell(event);
            }
            else if (event.type === "CHANGE_CELL_TYPE") {
                controls.changeCellType(event);
            }
            else if (event.type === "RESET_CELL") {
                controls.resetCell(event);
            }
            else if (event.type === "FOCUS_CELL") {
                controls.focusCell(event);
            }
            else if (event.type === "SAVE") {
                controls.save(event);
            }
            else if (event.type === "MOVE_CELL") {
                controls.moveCell(event);
            }
        },
        subscribeToCellChanges(id, callback) {
            const listeners = rt.internal.listeners.cellContentChanges.get(id);
            if (listeners !== undefined) {
                listeners.push(callback);
            }
            else {
                rt.internal.listeners.cellContentChanges.set(id, [callback]);
            }
        },
        unsubscribeToCellChanges(id, callback) {
            const listeners = rt.internal.listeners.cellContentChanges.get(id);
            if (!listeners)
                return;
            const idx = listeners.indexOf(callback);
            if (idx === -1)
                return;
            listeners.splice(idx, 1);
        },
        async registerPlugin(plugin, opts) {
            await plugin.register(rt, opts);
            rt.plugins.register(plugin.id, plugin);
        },
    };
    rt.controls = controls;
    rt.exports = createExports();
    setupGlobalKeybindings(rt);
    /** Initialize certain functionality */
    updateCellsWhenCellDefinitionChanges(rt);
    updateCellsWhenPropertyGetsDefined(rt);
    window.runtime = rt;
    setupCommunicationWithParentFrame(rt);
    registerDefaultPlugins(rt);
    updateIframeWhenSizeChanges(rt);
    return rt;
}
//# sourceMappingURL=create.js.map
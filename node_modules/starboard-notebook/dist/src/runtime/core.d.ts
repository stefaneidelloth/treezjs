import { Runtime } from "../types";
export declare function initPythonExecutionMode(runtime: Runtime): void;
/**
 * When new cell types are registered, or overwritten, the corresponding cells should update.
 * For example: if there is a my-language cell present, which is loaded dynamically in the first cell,
 * subsequent cells should update to this new definition.
 */
export declare function updateCellsWhenCellDefinitionChanges(runtime: Runtime): void;
/**
 * When new cell property is registered, or overwritten, the corresponding cells should update.
 */
export declare function updateCellsWhenPropertyGetsDefined(runtime: Runtime): void;
export declare function setupCommunicationWithParentFrame(runtime: Runtime): void;
export declare function updateIframeWhenSizeChanges(runtime: Runtime): void;
export declare function registerDefaultPlugins(runtime: Runtime): Promise<void>;
export declare function setupGlobalKeybindings(runtime: Runtime): void;

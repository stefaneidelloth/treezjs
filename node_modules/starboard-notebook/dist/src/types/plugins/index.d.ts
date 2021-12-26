import { Runtime } from "..";
export interface StarboardPlugin<PluginRegisterOpts = any, PluginExports extends Record<string, any> | undefined = any> {
    /**
     * Unique identifier for this plugin.
     */
    id: string;
    metadata: {
        /**
         * Name of the plugin (for humans)
         */
        name: string;
        version?: string;
    };
    exports: PluginExports;
    /**
     * Called automatically when the plugin gets registered, use this to create any DOM elements or register any cell types.
     */
    register(runtime: Runtime, opts?: PluginRegisterOpts): Promise<void> | void;
    [key: string]: any;
}

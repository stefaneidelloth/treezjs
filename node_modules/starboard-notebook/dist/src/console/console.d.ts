import { Methods } from "console-feed-modern/lib/definitions/Methods";
export declare type MessageMethod = Methods | "result" | "command";
export interface Message {
    method: MessageMethod;
    data: any[];
}
export declare type MessageCallback = (message: Message) => void;
export declare class ConsoleCatcher {
    private currentHook?;
    /**
     * The console's original log/debug/etc methods, so we can still
     * log unhooked.
     */
    private originalMethods;
    constructor(console: Console);
    hook(callback: MessageCallback): void;
    unhook(callback: MessageCallback): void;
    /**
     * Can be used to circumvent the console catcher.
     */
    getRawConsoleMethods(): {
        log: (...v: any) => any;
        debug: (...v: any) => any;
        info: (...v: any) => any;
        warn: (...v: any) => any;
        error: (...v: any) => any;
        table: (...v: any) => any;
        clear: (...v: any) => any;
        time: (...v: any) => any;
        timeEnd: (...v: any) => any;
        count: (...v: any) => any;
        assert: (...v: any) => any;
    };
}

import { LitElement } from "lit";
import { ConsoleCatcher, Message } from "../../console/console";
export declare class ConsoleOutputElement extends LitElement {
    private logHook;
    private updatePending;
    logs: any[];
    constructor();
    createRenderRoot(): this;
    hook(consoleCatcher: ConsoleCatcher): void;
    unhook(consoleCatcher: ConsoleCatcher): void;
    unhookAfterOneTick(consoleCatcher: ConsoleCatcher): Promise<unknown>;
    addEntry(msg: Message): void;
    render(): import("lit").TemplateResult<1>;
}

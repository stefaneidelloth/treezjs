export interface StarboardConsoleOutputIProps {
    logs: any[];
    logFilter?: () => boolean;
}
export declare function renderStandardConsoleOutputIntoElement(intoElement: HTMLElement, logs: any[]): void;

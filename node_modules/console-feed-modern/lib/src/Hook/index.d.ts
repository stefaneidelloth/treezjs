import { HookedConsole, Callback } from '../definitions/Console';
/**
 * Hook a console constructor and forward messages to a callback
 * @argument console The Console constructor to Hook
 * @argument callback The callback to be called once a message is logged
 */
export default function Hook(console: Console, callback: Callback, encode?: boolean): HookedConsole;

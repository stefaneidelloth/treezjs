import { HookedConsole } from '../definitions/Console';
/**
 * Unhook a console constructor and restore back the Native methods
 * @argument console The Console constructor to Hook
 */
declare function Unhook(console: HookedConsole): boolean;
export default Unhook;

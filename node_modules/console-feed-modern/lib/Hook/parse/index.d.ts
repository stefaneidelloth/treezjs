import { Methods } from '../../definitions/Console';
import { Payload } from '../../definitions/Payload';
/**
 * Parses a console log and converts it to a special Log object
 * @argument method The console method to parse
 * @argument data The arguments passed to the console method
 */
declare function Parse(method: Methods, data: any[], staticID?: string): Payload | false;
export default Parse;

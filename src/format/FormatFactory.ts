import {Format} from "./Format";
import {StringFormat} from "./StringFormat";
import {NumberFormat} from "./NumberFormat";
import {DateFormat} from "./DateFormat";

export class FormatFactory {

    static getFormat(format: string): Format {
        let name;
        let args;
        const match = format.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/);
        if (match) {
            name = match[1];
            args = match[2].split(',').map(arg => arg.trim().replace(/^['"]|['"]$/g, ''));
        }
        if(format.startsWith('string')){
            return new StringFormat(args[0]);
        }
        if(format.startsWith('number')){
            return new NumberFormat(args[0]);
        }
        if(format.startsWith('date')){
            return new DateFormat(args[0]);
        }
        return null;
    }

}

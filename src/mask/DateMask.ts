namespace duice {

    /**
     * duice.DateFormat
     */
    export class DateMask implements Mask<string> {

        pattern:string;

        patternRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;

        /**
         * Constructor
         * @param pattern
         */
        constructor(pattern?: string){
            this.pattern = pattern;
        }

        /**
         * Encodes date string
         * @param string
         */
        encode(string: string): string {
            if (!string) {
                return '';
            }
            if (!this.pattern) {
                return new Date(string).toString();
            }
            let date = new Date(string);
            string = this.pattern.replace(this.patternRex, function ($1: any) {
                switch ($1) {
                    case "yyyy":
                        return date.getFullYear();
                    case "yy":
                        return padLeft(String(date.getFullYear() % 1000), 2, '0');
                    case "MM":
                        return padLeft(String(date.getMonth() + 1), 2, '0');
                    case "dd":
                        return padLeft(String(date.getDate()), 2, '0');
                    case "HH":
                        return padLeft(String(date.getHours()), 2, '0');
                    case "hh":
                        return padLeft(String(date.getHours() <= 12 ? date.getHours() : date.getHours() % 12), 2, '0');
                    case "mm":
                        return padLeft(String(date.getMinutes()), 2, '0');
                    case "ss":
                        return padLeft(String(date.getSeconds()), 2, '0');
                    default:
                        return $1;
                }
            });
            return string;
        }

        /**
         * Decodes formatted date string to ISO date string.
         * @param string
         */
        decode(string:string):string{
            if(!string){
                return null;
            }
            if(!this.pattern){
                return new Date(string).toISOString();
            }
            let date = new Date(0,0,0,0,0,0);
            let match;
            while ((match = this.patternRex.exec(this.pattern)) != null) {
                let formatString = match[0];
                let formatIndex = match.index;
                let formatLength = formatString.length;
                let matchValue = string.substr(formatIndex, formatLength);
                matchValue = padRight(matchValue, formatLength,'0');
                switch (formatString) {
                    case 'yyyy': {
                        let fullYear = parseInt(matchValue);
                        date.setFullYear(fullYear);
                        break;
                    }
                    case 'yy': {
                        let yyValue = parseInt(matchValue);
                        let yearPrefix = Math.floor(new Date().getFullYear() / 100);
                        let fullYear = yearPrefix * 100 + yyValue;
                        date.setFullYear(fullYear);
                        break;
                    }
                    case 'MM': {
                        let monthValue = parseInt(matchValue);
                        date.setMonth(monthValue - 1);
                        break;
                    }
                    case 'dd': {
                        let dateValue = parseInt(matchValue);
                        date.setDate(dateValue);
                        break;
                    }
                    case 'HH': {
                        let hoursValue = parseInt(matchValue);
                        date.setHours(hoursValue);
                        break;
                    }
                    case 'hh': {
                        let hoursValue = parseInt(matchValue);
                        date.setHours(hoursValue > 12 ? (hoursValue + 12) : hoursValue);
                        break;
                    }
                    case 'mm': {
                        let minutesValue = parseInt(matchValue);
                        date.setMinutes(minutesValue);
                        break;
                    }
                    case 'ss': {
                        let secondsValue = parseInt(matchValue);
                        date.setSeconds(secondsValue);
                        break;
                    }
                }
            }
            return date.toISOString();
        }
    }

}
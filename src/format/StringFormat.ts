namespace duice.format {

    /**
     * StringFormat
     * @param string format
     */
    export class StringFormat implements Format {

        pattern: string;

        /**
         * Constructor
         * @param pattern
         */
        constructor(pattern: string){
            this.pattern = pattern;
        }

        /**
         * encode string as format
         * @param value
         */
        encode(value: string): string{
            if(!value) {
                return value;
            }
            let encodedValue = '';
            let patternChars = this.pattern.split('');
            let valueChars = value.split('');
            let valueCharsPosition = 0;
            for(let i = 0, size = patternChars.length; i < size; i ++ ){
                let patternChar = patternChars[i];
                if(patternChar === '#'){
                    encodedValue += valueChars[valueCharsPosition++] || '';
                } else {
                    encodedValue += patternChar;
                }
                if(valueCharsPosition >= valueChars.length){
                   break;
                }
            }
            return encodedValue;
        }

        /**
         * decodes string as format
         * @param value
         */
        decode(value: string): string {
            if(!value) {
                return value;
            }
            let decodedValue = '';
            let patternChars = this.pattern.split('');
            let valueChars = value.split('');
            let valueCharsPosition = 0;
            for(let i = 0, size = patternChars.length; i < size; i ++ ){
                let patternChar = patternChars[i];
                if (patternChar === '#') {
                    decodedValue += valueChars[valueCharsPosition++] || '';
                } else {
                    valueCharsPosition++;
                }
            }
            return decodedValue;
        }
    }

}
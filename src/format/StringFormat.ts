import {Format} from "./Format";

export class StringFormat implements Format {

    pattern: string;

    constructor(pattern: string){
        this.pattern = pattern;
    }

    format(value: string): string{
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

    parse(value: string): string {
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
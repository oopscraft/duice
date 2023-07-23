namespace duice.format {

    export class NumberFormat implements Format {

        scale:number = 0;

        constructor(scale?: number){
            this.scale = scale;
        }

        format(number: number): string {
            if(isNaN(Number(number))){
                return '';
            }
            number = Number(number);
            let string = String(number.toFixed(this.scale)) as string;
            let reg = /(^[+-]?\d+)(\d{3})/;
            while (reg.test(string)) {
                string = string.replace(reg, '$1' + ',' + '$2');
            }
            return string;
        }

        parse(string: string): number{
            if(!string) {
                return null;
            }
            if(string.length === 1 && /[+-]/.test(string)){
                string += '0';
            }
            string = string.replace(/,/gi,'');
            if(isNaN(Number(string))){
                throw 'NaN';
            }
            let number = Number(string);
            number = Number(number.toFixed(this.scale));
            return number;
        }

    }

}


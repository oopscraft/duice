namespace duice.format {

    export class FormatFactory {

        /**
         * return format instance
         * @param format
         */
        static getFormat(format: string): Format {
            if(format.startsWith('string')){
                format = format.replace('string', 'StringFormat');
            }
            if(format.startsWith('number')){
                format = format.replace('number', 'NumberFormat');
            }
            if(format.startsWith('date')){
                format = format.replace('date', 'DateFormat');
            }
            return Function(`return new duice.format.${format};`).call(null);
        }

    }

}
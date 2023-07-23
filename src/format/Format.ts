namespace duice.format {

    export interface Format {

        format(value: any): any;

        parse(value: any): any;

    }

}


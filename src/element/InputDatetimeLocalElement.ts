///<reference path="../format/NumberFormat.ts"/>
///<reference path="InputElement.ts"/>
namespace duice.component {

    /**
     * input datetime-local element component
     */
    export class InputDatetimeLocalElement extends InputElement {

        dateFormat: duice.format.DateFormat = new duice.format.DateFormat('yyyy-MM-ddTHH:mm:ss');

        /**
         * constructor
         * @param element
         * @param bindData
         * @param context
         */
        constructor(element: HTMLInputElement, bindData: object, context: object) {
            super(element, bindData, context);
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: string): void {
            this.getHtmlElement().value = this.dateFormat.format(value);
        }

        /**
         * return value
         */
        override getValue(): any {
            return this.dateFormat.parse(this.getHtmlElement().value);
        }

    }

}
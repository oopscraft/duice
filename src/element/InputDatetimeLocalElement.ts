///<reference path="../format/NumberFormat.ts"/>
///<reference path="InputElement.ts"/>
namespace duice.element {

    export class InputDatetimeLocalElement extends InputElement {

        dateFormat: duice.format.DateFormat = new duice.format.DateFormat('yyyy-MM-ddTHH:mm:ss');

        constructor(element: HTMLInputElement, bindData: object, context: object) {
            super(element, bindData, context);
        }

        override setValue(value: string): void {
            this.getHtmlElement().value = this.dateFormat.format(value);
        }

        override getValue(): any {
            return this.dateFormat.parse(this.getHtmlElement().value);
        }

    }

}
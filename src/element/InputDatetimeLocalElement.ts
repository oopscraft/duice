///<reference path="../format/NumberFormat.ts"/>
///<reference path="InputElement.ts"/>
namespace duice.element {

    export class InputDatetimeLocalElement extends InputElement {

        dateFormat: duice.format.DateFormat = new duice.format.DateFormat('yyyy-MM-ddTHH:mm');

        constructor(element: HTMLInputElement, bindData: object, context: object) {
            super(element, bindData, context);
        }

        override setValue(value: string): void {
            if(value) {
                this.getHtmlElement().value = this.dateFormat.format(value);
            }else{
                this.getHtmlElement().value = '';
            }
        }

        override getValue(): any {
            let value = this.getHtmlElement().value;
            if(value) {
                return new Date(value).toISOString();
            }else{
                return null;
            }
        }

    }

}
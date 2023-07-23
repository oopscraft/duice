///<reference path="../format/NumberFormat.ts"/>
///<reference path="InputElement.ts"/>
namespace duice.element {

    export class InputNumberElement extends InputElement {

        constructor(element: HTMLInputElement, bindData: object, context: object) {
            super(element, bindData, context);

            // changes type and style
            this.getHtmlElement().removeAttribute('type');
            this.getHtmlElement().style.textAlign = 'right';

            // prevents invalid key press
            this.getHtmlElement().addEventListener('keypress', event => {
                if(/[\d|\.|,]/.test(event.key) === false) {
                    event.preventDefault();
                }
            });
        }

        override getValue(): any {
            let value = super.getValue();
            return Number(value);
        }

    }

}
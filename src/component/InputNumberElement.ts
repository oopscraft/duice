///<reference path="../format/NumberFormat.ts"/>
///<reference path="InputElement.ts"/>
namespace duice.component {

    /**
     * input number element component
     */
    export class InputNumberElement extends InputElement {

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);

            // changes type and style
            this.getElement().removeAttribute('type');
            this.getElement().style.textAlign = 'right';

            // prevents invalid key press
            this.getElement().addEventListener('keypress', event => {
                if(/[\d|\.|,]/.test(event.key) === false) {
                    event.preventDefault();
                }
            });
        }

        /**
         * return value
         */
        override getValue(): any {
            let value = super.getValue();
            return Number(value);
        }

    }

}
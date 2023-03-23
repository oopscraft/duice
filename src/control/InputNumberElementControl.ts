///<reference path="../mask/NumberMask.ts"/>
namespace duice {

    /**
     * InputNumberElement
     */
    export class InputNumberControl extends InputControl {

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
         * getValue
         */
        getValue(): any {
            let value = super.getValue();
            return Number(value);
        }

    }

}
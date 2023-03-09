///<reference path="../mask/NumberMask.ts"/>
namespace duice {

    /**
     * InputNumberElement
     */
    export class InputNumberElement extends InputElement {

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: HTMLInputElement, context: object) {
            super(htmlElement, context);

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

        /**
         * getValue
         */
        getValue(): any {
            let value = super.getValue();
            return Number(value);
        }

    }

}
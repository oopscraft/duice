namespace duice.element {

    import NumberMask = duice.mask.NumberMask;
    import Mask = duice.mask.Mask;

    /**
     * InputNumberElement
     */
    export class InputNumberElement extends InputElement {

        mask: Mask = new NumberMask();

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
         * doGetValue
         */
        doGetValue(): any {
            let value = super.doGetValue();
            return Number(value);
        }

    }

}
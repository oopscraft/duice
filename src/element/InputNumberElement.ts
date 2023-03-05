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

            // key press event
            this.htmlElement.removeAttribute('type');
            this.getHtmlElement().addEventListener('keypress', event => {
                if(/[\d|\.|,]/.test(event.key) === false) {
                    event.preventDefault();
                }
            });
        }

        /**
         * doRender
         * @param data
         */
        doRender(data: object): void {
            super.doRender(data);
        }

        /**
         * doUpdate
         * @param data
         * @param detail
         */
        doUpdate(data: object, detail: object): void {
            this.doRender(data);
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
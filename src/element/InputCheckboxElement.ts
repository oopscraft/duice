namespace duice.element {

    /**
     * InputCheckboxElement
     */
    export class InputCheckboxElement extends InputElement {

        trueValue: any = true;

        falseValue: any = false;

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: HTMLInputElement, context: object) {
            super(htmlElement, context);

            // true false value
            let trueValue = getAttribute(this.getHtmlElement(), 'true-value');
            this.trueValue = trueValue ? trueValue : this.trueValue;
            let falseValue = getAttribute(this.getHtmlElement(), 'false-value');
            this.falseValue = falseValue ? falseValue : this.falseValue;
        }

        /**
         * doSetValue
         * @param value
         */
        doSetValue(value: any): void {
            if (value === this.trueValue) {
                this.getHtmlElement().checked = true;
            } else {
                this.htmlElement.checked = false;
            }
        }

        /**
         * doGetValue
         */
        doGetValue(): any {
            if(this.htmlElement.checked){
                return this.trueValue;
            }else{
                return this.falseValue;
            }
        }

    }

}
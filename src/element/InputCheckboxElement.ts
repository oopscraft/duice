namespace duice.element {

    /**
     * InputCheckboxElement
     */
    export class InputCheckboxElement extends InputElement {

        trueValue: any;

        falseValue: any;

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: HTMLInputElement, context: object) {
            super(htmlElement, context);

            // true false value
            let trueValue = getAttribute(this.getHtmlElement(), 'true-value');
            this.trueValue = trueValue ? trueValue : true;
            let falseValue = getAttribute(this.getHtmlElement(), 'false-value');
            this.falseValue = falseValue ? falseValue : false;

            // add change event listener
            let _this = this;
            this.getHtmlElement().addEventListener('change', event => {
                _this.notifyObservers({});
            }, true);
        }

        /**
         * doRender
         * @param data
         */
        doRender(data: object): void {
            let value = data[this.getProperty()];
            if(value === this.trueValue){
                this.htmlElement.checked = true;
            }else{
                this.htmlElement.checked = false;
            }
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
            if(this.htmlElement.checked){
                return this.trueValue;
            }else{
                return this.falseValue;
            }
        }

    }

}
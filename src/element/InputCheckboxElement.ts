///<reference path="InputElement.ts"/>
namespace duice.component {

    /**
     * InputCheckboxElement
     */
    export class InputCheckboxElement extends InputElement {

        trueValue: any = true;

        falseValue: any = false;

        /**
         * constructor
         * @param element
         * @param object
         */
        constructor(element: HTMLInputElement, object: object) {
            super(element, object);

            // true false value
            let trueValue = getElementAttribute(this.getHtmlElement(), 'true-value');
            this.trueValue = trueValue ? trueValue : this.trueValue;
            let falseValue = getElementAttribute(this.getHtmlElement(), 'false-value');
            this.falseValue = falseValue ? falseValue : this.falseValue;
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            if (value === this.trueValue) {
                this.getHtmlElement().checked = true;
            } else {
                this.htmlElement.checked = false;
            }
        }

        /**
         * get value
         */
        override getValue(): any {
            if(this.htmlElement.checked){
                return this.trueValue;
            }else{
                return this.falseValue;
            }
        }

        /**
         * set readonly
         * @param readonly
         */
        override setReadonly(readonly: boolean): void {
            if(readonly){
                this.getHtmlElement().style.pointerEvents = 'none';
            }else{
                this.getHtmlElement().style.pointerEvents = '';
            }
        }

    }

}
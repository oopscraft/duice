///<reference path="InputElement.ts"/>
namespace duice {

    /**
     * InputCheckboxElement
     */
    export class InputCheckboxElement extends InputElement {

        private readonly trueValue: any = true;

        private readonly falseValue: any = false;

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);

            // true false value
            let trueValue = getComponentAttribute(this.getElement(), 'true-value');
            this.trueValue = trueValue ? trueValue : this.trueValue;
            let falseValue = getComponentAttribute(this.getElement(), 'false-value');
            this.falseValue = falseValue ? falseValue : this.falseValue;
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            if (value === this.trueValue) {
                this.getElement().checked = true;
            } else {
                this.element.checked = false;
            }
        }

        /**
         * get value
         */
        override getValue(): any {
            if(this.element.checked){
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
                this.getElement().style.pointerEvents = 'none';
            }else{
                this.getElement().style.pointerEvents = '';
            }
        }

    }

}
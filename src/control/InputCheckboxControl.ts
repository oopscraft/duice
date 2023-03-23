///<reference path="InputControl.ts"/>
namespace duice {

    /**
     * InputCheckboxElement
     */
    export class InputCheckboxControl extends InputControl {

        trueValue: any = true;

        falseValue: any = false;

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);

            // true false value
            let trueValue = getAttribute(this.getElement(), 'true-value');
            this.trueValue = trueValue ? trueValue : this.trueValue;
            let falseValue = getAttribute(this.getElement(), 'false-value');
            this.falseValue = falseValue ? falseValue : this.falseValue;
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): void {
            if (value === this.trueValue) {
                this.getElement().checked = true;
            } else {
                this.element.checked = false;
            }
        }

        /**
         * getValue
         */
        getValue(): any {
            if(this.element.checked){
                return this.trueValue;
            }else{
                return this.falseValue;
            }
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            if(readonly){
                this.getElement().style.pointerEvents = 'none';
            }else{
                this.getElement().style.pointerEvents = '';
            }
        }

    }

}
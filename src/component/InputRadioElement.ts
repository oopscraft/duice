///<reference path="InputElement.ts"/>
namespace duice {

    /**
     * input radio element component
     */
    export class InputRadioElement extends InputElement {

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            this.getElement().checked = (this.getElement().value === value);
        }

        /**
         * return value
         */
        override getValue(): any {
            return this.getElement().value;
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
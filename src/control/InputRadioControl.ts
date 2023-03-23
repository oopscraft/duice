///<reference path="InputControl.ts"/>
namespace duice {

    /**
     * InputRadioElement
     */
    export class InputRadioControl extends InputControl {

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): void {
            if(this.getElement().value === value){
                this.getElement().checked = true;
            }else{
                this.getElement().checked = false;
            }
        }

        /**
         * getValue
         */
        getValue(): any {
            return this.getElement().value;
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
///<reference path="InputElement.ts"/>
namespace duice {

    /**
     * InputRadioElement
     */
    export class InputRadioElement extends InputElement {

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: HTMLInputElement, context: object) {
            super(htmlElement, context);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): void {
            if(this.getHtmlElement().value === value){
                this.getHtmlElement().checked = true;
            }else{
                this.getHtmlElement().checked = false;
            }
        }

        /**
         * getValue
         */
        getValue(): any {
            return this.getHtmlElement().value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            if(readonly){
                this.getHtmlElement().style.pointerEvents = 'none';
            }else{
                this.getHtmlElement().style.pointerEvents = '';
            }
        }

    }

}
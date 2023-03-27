///<reference path="InputElement.ts"/>
namespace duice.component {

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
            this.getHtmlElement().checked = (this.getHtmlElement().value === value);
        }

        /**
         * return value
         */
        override getValue(): any {
            return this.getHtmlElement().value;
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
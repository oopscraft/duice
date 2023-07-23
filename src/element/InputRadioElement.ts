///<reference path="InputElement.ts"/>
namespace duice.element {

    export class InputRadioElement extends InputElement {

        constructor(element: HTMLInputElement, bindData: object, context: object) {
            super(element, bindData, context);
        }

        override setValue(value: any): void {
            this.getHtmlElement().checked = (this.getHtmlElement().value === value);
        }

        override getValue(): any {
            return this.getHtmlElement().value;
        }

        override setReadonly(readonly: boolean): void {
            if(readonly){
                this.getHtmlElement().style.pointerEvents = 'none';
            }else{
                this.getHtmlElement().style.pointerEvents = '';
            }
        }

    }

}
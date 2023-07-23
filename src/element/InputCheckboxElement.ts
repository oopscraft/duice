///<reference path="InputElement.ts"/>
namespace duice.element {

    export class InputCheckboxElement extends InputElement {

        trueValue: any = true;

        falseValue: any = false;

        constructor(element: HTMLInputElement, bindData: object, context: object) {
            super(element, bindData, context);

            // true false value
            let trueValue = getElementAttribute(this.getHtmlElement(), 'true-value');
            this.trueValue = trueValue ? trueValue : this.trueValue;
            let falseValue = getElementAttribute(this.getHtmlElement(), 'false-value');
            this.falseValue = falseValue ? falseValue : this.falseValue;
        }

        override setValue(value: any): void {
            if (value === this.trueValue) {
                this.getHtmlElement().checked = true;
            } else {
                this.htmlElement.checked = false;
            }
        }

        override getValue(): any {
            if(this.htmlElement.checked){
                return this.trueValue;
            }else{
                return this.falseValue;
            }
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
namespace duice.element {

    export class InputElement extends ObjectElement<HTMLInputElement> {

        constructor(element: HTMLInputElement, bindData: object, context: object) {
            super(element, bindData, context);

            // adds change listener
            this.getHtmlElement().addEventListener('change', e => {
                let event = new duice.event.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);

            // turn off autocomplete
            this.getHtmlElement().setAttribute('autocomplete','off');
        }

        override setValue(value: any): void {
            if(value) {
                value = this.getFormat() ? this.getFormat().format(value) : value;
            }else{
                value = '';
            }
            this.getHtmlElement().value = value;
        }

        override getValue(): any {
            let value = this.getHtmlElement().value;
            if(value){
                value = this.getFormat() ? this.getFormat().parse(value) : value;
            }else{
                value = null;
            }
            return value;
        }

        override setReadonly(readonly: boolean): void {
            this.getHtmlElement().readOnly = readonly;
        }

        override setDisable(disable: boolean): void {
            if(disable) {
                this.getHtmlElement().setAttribute('disabled', 'disabled');
            }else{
                this.getHtmlElement().removeAttribute('disabled');
            }
        }

        override focus(): boolean {
            this.getHtmlElement().focus();
            return true;
        }

    }

}


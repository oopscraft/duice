namespace duice.component {

    /**
     * input element component
     */
    export class InputElement extends ObjectElement<HTMLInputElement> {

        /**
         * constructor
         * @param element
         * @param object
         */
        constructor(element: HTMLInputElement, object: object) {
            super(element, object);

            // adds change listener
            this.getHtmlElement().addEventListener('change', e => {
                let event = new duice.event.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);

            // turn off autocomplete
            this.getHtmlElement().setAttribute('autocomplete','off');
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            if(value) {
                value = this.getFormat() ? this.getFormat().format(value) : value;
            }else{
                value = '';
            }
            this.getHtmlElement().value = value;
        }

        /**
         * return value
         */
        override getValue(): any {
            let value = this.getHtmlElement().value;
            if(value){
                value = this.getFormat() ? this.getFormat().parse(value) : value;
            }else{
                value = null;
            }
            return value;
        }

        /**
         * set readonly
         * @param readonly
         */
        override setReadonly(readonly: boolean): void {
            this.getHtmlElement().readOnly = readonly;
        }

        /**
         * set disable
         * @param disable
         */
        override setDisable(disable: boolean): void {
            if(disable) {
                this.getHtmlElement().setAttribute('disabled', 'disabled');
            }else{
                this.getHtmlElement().removeAttribute('disabled');
            }
        }

        /**
         * focus
         */
        override focus(): boolean {
            this.getHtmlElement().focus();
            return true;
        }

    }

}


namespace duice.component {

    /**
     * textarea element component
     */
    export class TextareaElement extends ObjectElement<HTMLTextAreaElement> {

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLTextAreaElement, context: object) {
            super(element, context);

            // adds change event listener
            this.getHtmlElement().addEventListener('change', e => {
                let event = new duice.event.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            if(value) {
                this.getHtmlElement().value = value;
            }else{
                this.getHtmlElement().value = '';
            }
        }

        /**
         * return value
         */
        override getValue(): any {
            let value = this.getHtmlElement().value;
            if(value != null && value.length > 0) {
                return value;
            }else{
                return null;
            }
        }

        /**
         * set readonly
         * @param readonly
         */
        override setReadonly(readonly: boolean): void {
            if(readonly){
                this.getHtmlElement().setAttribute('readonly', 'readonly');
            }else {
                this.getHtmlElement().removeAttribute('readonly');
            }
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

    }

}
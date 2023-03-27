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
            this.getHtmlElement().value = value;
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
                this.getHtmlElement().setAttribute('readonly', 'readonly');
            }else {
                this.getHtmlElement().removeAttribute('readonly');
            }
        }

    }

}
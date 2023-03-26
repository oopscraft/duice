namespace duice {

    /**
     * textarea element component
     */
    export class TextareaElement extends ObjectComponent<HTMLTextAreaElement> {

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLTextAreaElement, context: object) {
            super(element, context);

            // adds change event listener
            this.getElement().addEventListener('change', e => {
                let event = new PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            this.getElement().value = value;
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
                this.getElement().setAttribute('readonly', 'readonly');
            }else {
                this.getElement().removeAttribute('readonly');
            }
        }

    }

}
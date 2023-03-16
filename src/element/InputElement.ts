namespace duice {

    /**
     * InputElement
     */
    export class InputElement extends Element<HTMLInputElement> {

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: HTMLInputElement, context: object) {
            super(htmlElement, context);

            // adds change listener
            this.getHtmlElement().addEventListener('change', e => {
                let event = new PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): void {
            if(value) {
                value = this.getMask() ? this.getMask().encode(value) : value;
            }else{
                value = '';
            }
            this.getHtmlElement().value = value;
        }

        /**
         * getValue
         */
        getValue(): any {
            let value = this.getHtmlElement().value;
            if(value){
                value = this.getMask() ? this.getMask().decode(value) : value;
            }else{
                value = null;
            }
            return value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            this.getHtmlElement().readOnly = readonly;
        }

    }

}


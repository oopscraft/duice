namespace duice {

    /**
     * InputElementControl
     */
    export class InputElementControl extends ElementControl<HTMLInputElement> {

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);

            // adds change listener
            this.getElement().addEventListener('change', e => {
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
            this.getElement().value = value;
        }

        /**
         * getValue
         */
        getValue(): any {
            let value = this.getElement().value;
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
            this.getElement().readOnly = readonly;
        }

    }

}


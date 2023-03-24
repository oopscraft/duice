namespace duice {

    /**
     * TextareaElementControl
     */
    export class TextareaElementControl extends ElementControl<HTMLTextAreaElement> {

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
         * setValue
         * @param value
         */
        setValue(value: any): void {
            this.getElement().value = value;
        }

        /**
         * getValue
         */
        getValue(): any {
            let value = this.getElement().value;
            return value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            if(readonly){
                this.getElement().setAttribute('readonly', 'readonly');
            }else {
                this.getElement().removeAttribute('readonly');
            }
        }

    }

}
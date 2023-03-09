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
            this.getHtmlElement().addEventListener('change', event => {
                this.notifyObservers({});
            }, true);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): void {
            value = this.getMask() ? this.getMask().encode(value) : value;
            this.getHtmlElement().value = value;
        }

        /**
         * getValue
         */
        getValue(): any {
            let value = this.getHtmlElement().value;
            value = this.getMask() ? this.getMask().decode(value) : value;
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


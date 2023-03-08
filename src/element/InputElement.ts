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
                this.checkBeforeChange(event);
                this.notifyObservers({});
            }, true);
        }

        /**
         * doSetValue
         * @param value
         */
        doSetValue(value: any): void {
            this.getHtmlElement().value = value;
        }

        /**
         * doGetValue
         */
        doGetValue(): any {
            return this.getHtmlElement().value;
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


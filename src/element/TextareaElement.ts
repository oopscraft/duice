namespace duice.element {

    /**
     * Textarea
     */
    export class TextareaElement extends Element<HTMLTextAreaElement> {

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: HTMLTextAreaElement, context: object) {
            super(htmlElement, context);

            // adds change event listener
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
            let value = this.getHtmlElement().value;
            return value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            if(readonly){
                this.getHtmlElement().setAttribute('readonly', 'readonly');
            }else {
                this.getHtmlElement().removeAttribute('readonly');
            }
        }

    }

}
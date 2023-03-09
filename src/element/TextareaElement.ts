namespace duice {

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
                this.notifyObservers({});
            }, true);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): void {
            this.getHtmlElement().value = value;
        }

        /**
         * getValue
         */
        getValue(): any {
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
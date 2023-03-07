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
            let _this = this;
            this.getHtmlElement().addEventListener('change', event => {
                _this.notifyObservers({});
            }, true);
        }

        /**
         * doRender
         * @param data
         */
        doRender(data: object): void {
            let value = getPropertyValue(data, this.getProperty());
            this.getHtmlElement().value = value;
        }

        /**
         * doUpdate
         * @param data
         * @param detail
         */
        doUpdate(data: object, detail: object): void {
            this.doRender(data);
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
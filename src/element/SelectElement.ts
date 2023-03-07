namespace duice.element {

    /**
     * SelectElement
     */
    export class SelectElement extends Element<HTMLSelectElement> {

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: HTMLSelectElement, context: object){
            super(htmlElement, context);

            // adds event listener
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
            return this.getHtmlElement().value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            if(readonly){
                this.getHtmlElement().style.pointerEvents = 'non';
            }else{
                this.getHtmlElement().style.pointerEvents = '';
            }
        }

    }

}
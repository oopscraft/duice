namespace duice {

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
            if(readonly){
                this.getHtmlElement().style.pointerEvents = 'non';
            }else{
                this.getHtmlElement().style.pointerEvents = '';
            }
        }

    }

}
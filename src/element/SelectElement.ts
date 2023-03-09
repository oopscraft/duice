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
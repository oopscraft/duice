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
            this.getHtmlElement().addEventListener('change', (e) => {
                let event = new PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
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
                console.warn("==ok");
                this.getHtmlElement().style.pointerEvents = 'none';
            }else{
                this.getHtmlElement().style.pointerEvents = '';
            }
        }

    }

}
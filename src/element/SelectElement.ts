namespace duice.component {

    /**
     * select element component
     */
    export class SelectElement extends ObjectElement<HTMLSelectElement> {

        /**
         * constructor
         * @param element
         * @param bindData
         * @param context
         */
        constructor(element: HTMLSelectElement, bindData: object, context: object){
            super(element, bindData, context);

            // adds event listener
            this.getHtmlElement().addEventListener('change', () => {
                let event = new duice.event.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            this.getHtmlElement().value = value;

            // force select option
            if(!value) {
                for(let i = 0; i < this.getHtmlElement().options.length; i++){
                    let option = this.getHtmlElement().options[i];
                    if(!option.nodeValue){
                        option.selected = true;
                        break;
                    }
                }
            }
        }

        /**
         * return value
         */
        override getValue(): any {
            let value = this.getHtmlElement().value;
            if(!value || value.trim().length < 1) {
                value = null;
            }
            return value;
        }

        /**
         * set readonly
         * @param readonly
         */
        override setReadonly(readonly: boolean): void {
            if(readonly){
                console.warn("==ok");
                this.getHtmlElement().style.pointerEvents = 'none';
            }else{
                this.getHtmlElement().style.pointerEvents = '';
            }
        }

        /**
         * set disable
         * @param disable
         */
        override setDisable(disable: boolean): void {
            if(disable) {
                this.getHtmlElement().setAttribute('disabled', 'disabled');
            }else{
                this.getHtmlElement().removeAttribute('disabled');
            }
        }

    }

}
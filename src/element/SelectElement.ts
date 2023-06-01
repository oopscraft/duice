namespace duice.component {

    /**
     * select element component
     */
    export class SelectElement extends ObjectElement<HTMLSelectElement> {

        /**
         * constructor
         * @param element
         * @param object
         */
        constructor(element: HTMLSelectElement, object: object){
            super(element, object);

            // adds event listener
            this.getHtmlElement().addEventListener('change', (e) => {
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
            return this.getHtmlElement().value;
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
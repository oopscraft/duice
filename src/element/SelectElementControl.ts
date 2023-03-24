namespace duice {

    /**
     * SelectElementControl
     */
    export class SelectElementControl extends ElementControl<HTMLSelectElement> {

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLSelectElement, context: object){
            super(element, context);

            // adds event listener
            this.getElement().addEventListener('change', (e) => {
                let event = new PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): void {
            this.getElement().value = value;

            // force select option
            if(!value) {
                for(let i = 0; i < this.getElement().options.length; i++){
                    let option = this.getElement().options[i];
                    if(!option.nodeValue){
                        option.selected = true;
                        break;
                    }
                }
            }
        }

        /**
         * getValue
         */
        getValue(): any {
            return this.getElement().value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            if(readonly){
                console.warn("==ok");
                this.getElement().style.pointerEvents = 'none';
            }else{
                this.getElement().style.pointerEvents = '';
            }
        }

    }

}
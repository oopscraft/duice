namespace duice.element {

    export class Input extends ObjectComponent {

        element: HTMLInputElement;

        constructor(element: HTMLInputElement) {
            super(element);
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyObservers(new Event(_this,{}));
            },true);
        }

        setValue(value: any): void {
            this.element.value = value;
        }

        /**
         * getValue
         */
        getValue() {
            return this.element.value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean) {
            if(readonly) {
                this.element.readOnly = readonly;
            }
        }


    }

    // defines component
    defineComponent(Input, "input", `${getAlias()}-input`);

}


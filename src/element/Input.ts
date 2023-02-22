namespace duice.element {

    export class Input extends MapComponent {

        element: HTMLInputElement;

        constructor(element: HTMLInputElement) {
            super(element);
        }

        override doInitialize(context: object): void {
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyObservers(new Event(_this, {}));
            },true);
        }

        /**
         * update
         * @param handler
         */
        override doUpdate(handler: duice.Observable, event: duice.MapEvent): void {
            console.debug("ObjectComponent.update", handler, event);
            let object = handler.getTarget();
            switch(event.getType()){
                case ObjectEventType.VALUE_CHANGE:
                    break;
            }

            let value = object[eve];
            this.setValue(value);
        }

        override doDestroy(): void {
            // no-op
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


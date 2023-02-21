namespace duice.element {

    export class Input extends ObjectComponent {

        element: HTMLInputElement;

        constructor(element: HTMLInputElement) {
            super(element);
        }

        override doInitialize(context: object): void {
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyObservers(new Event(_this,{}));
            },true);
        }

        /**
         * update
         * @param objectHandler
         */
        override doUpdate(objectHandler: ObjectHandler, event: ObjectEvent): void {
            console.debug("ObjectComponent.update", objectHandler, event);
            let object = objectHandler.getTarget();
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


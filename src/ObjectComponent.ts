namespace duice {

    import ValueChangeEvent = duice.event.ValueChangeEvent;

    /**
     * ObjectComponent
     */
    export abstract class ObjectComponent extends Component {

        name: string;

        /**
         * constructor
         * @param element
         * @protected
         */
        protected constructor(element: HTMLElement) {
            console.debug("ObjectComponent.constructor", element);
            super(element);
            this.name = this.getAttribute("name");
        }

        doUpdate(objectHandler: ObjectHandler, event: Event): void {
            if(event instanceof ValueChangeEvent){
                let value = objectHandler.get
            }
            switch(event){
                case ObjectEventType.VALUE_CHANGE:
                    if(event.getData()['name'] === this.name){
                        let value = objectHandler.get
                        this.setValue()
                    }
                    object[]
                    event.data.name
                    break;
            }
        }

        /**
         * getName
         */
        getName(): string {
            return this.name;
        }

        abstract setValue: void;

        abstract getValue: string;

    }

}

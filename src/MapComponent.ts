namespace duice {

    /**
     * ObjectComponent
     */
    export abstract class MapComponent extends Component {

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

        doUpdate(handler: duice.Observable, event: duice.MapEvent): void {
            if(event instanceof duice.event.ValueChangeEvent){
                if(event.getName() === this.name){
                    this.setValue(event.getValue());
                }
            }
        }

        abstract setValue(value: any): void;

        abstract getValue(): string;

    }

}

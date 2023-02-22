namespace duice {

    /**
     * ObjectComponent
     */
    export abstract class MapComponent extends Component {

        key: string;

        /**
         * constructor
         * @param element
         * @protected
         */
        protected constructor(element: HTMLElement) {
            console.debug("ObjectComponent.constructor", element);
            super(element);
            this.key = this.getAttribute("key");
        }

        /**
         * doInitialize
         * @param context
         */
        abstract doInitialize(context: object): void;

        /**
         * doUpdate
         * @param mapHandler
         * @param mapEvent
         */
        doUpdate(mapHandler: MapHandler, mapEvent: MapEvent): void {
            console.debug("MapComponent.doUpdate", mapHandler, mapEvent);
            switch(mapEvent.getType()){
                case MapEventType.SET_VALUE:
                    if(mapEvent.getDetail("key") === this.key){
                        this.setValue(mapEvent.getDetail("value"));
                    }
                    break;
                case MapEventType.SET_READONLY:
                    if(mapEvent.getDetail("key") === this.key){
                        this.setReadonly(mapEvent.getDetail("readonly"));
                    }
                    break;
                default:
                    throw Error("Invalid event type");
            }
        }

        /**
         * doDestroy
         */
        abstract doDestroy(): void;

        /**
         * setValue
         * @param value
         */
        abstract setValue(value: any): void;

        /**
         * setReadonly
         * @param readonly
         */
        abstract setReadonly(readonly: boolean): void;

    }

}

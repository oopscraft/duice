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
        doInitialize(context: object): void {
            console.debug("MapComponent.doInitialize", context);
        }

        /**
         * doUpdate
         * @param mapHandler
         * @param mapEvent
         */
        doUpdate(mapHandler: MapHandler, detail: object): void {
            console.debug("MapComponent.doUpdate", mapHandler, detail);
            this.setValue(mapHandler.get(this.key));
            this.setReadonly()
        }

        /**
         * doDestroy
         */
        doDestroy(): void {
            console.debug("MapComponent.doDestroy");
        }

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

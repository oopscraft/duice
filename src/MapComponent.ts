///<reference path="Observer.ts"/>
///<reference path="Component.ts"/>

namespace duice {

    /**
     * ObjectComponent
     */
    export abstract class MapComponent extends Component<Map> {

        key: string;

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement, context: object) {
            super(element, context);
            console.debug("MapComponent.constructor", element);
            this.key = this.getAttribute("key");

            // bind
            let map = findObject(context, this.getAttribute("bind"));
            console.log(map);
            let mapProxyHandler = getProxyHandler(map);
            mapProxyHandler.addObserver(this);
            this.addObserver(mapProxyHandler);

            // update
            this.update(mapProxyHandler);
        }

        /**
         * update
         * @param mapProxyHandler
         */
        update(mapProxyHandler: MapHandler): void {
            console.log("MapComponent.update", mapProxyHandler);
            let map = mapProxyHandler.getTarget();
            let value = map.get(this.key);
            this.setValue(value);
        }

        /**
         * getKey
         */
        getKey(): string {
            return this.key;
        }

        abstract setValue(value: any): void;

        abstract getValue(): any;

        abstract setReadonly(readonly: boolean);



    }

}

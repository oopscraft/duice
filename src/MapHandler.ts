namespace duice {

    /**
     * MapHandler
     */
    export class MapHandler extends Handler {

        /**
         * constructor
         * @param map
         */
        constructor(map: Map){
            super(map);
        }

        /**
         * doUpdate
         * @param mapComponent
         * @param event
         */
        doUpdate(mapComponent: MapComponent, mapEvent: MapEvent): void {
            console.debug("MapHandler.doUpdate", mapComponent, mapEvent);
        }

        /**
         * set
         * @param key
         * @param value
         */
        set(key: string, value: any): boolean {
            this.getTarget().set(key, value);
            this.notifyObservers(new MapEvent());
            return true;
        }

    }
}
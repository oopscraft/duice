namespace duice {

    /**
     * MapHandler
     */
    export class MapHandler extends Handler {

        readonly: object = {}

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
        doUpdate(mapComponent: MapComponent, detail): void {
            console.debug("MapHandler.doUpdate", mapComponent, mapEvent);
        }

        /**
         * set
         * @param key
         * @param value
         */
        set(key: string, value: any): void {
            this.getTarget().set(key, value);
            this.notifyObservers({key:key, value:value}));
        }

        /**
         * get
         * @param key
         */
        get(key: string): void {
            return this.getTarget().get(this.key);
        }

        setReadonly(key: string, readonly: boolean){
            this.readonly[key] = readon;
        }

        isReadonly(key: string): void {
            return this.readonly[key];
        }

    }
}
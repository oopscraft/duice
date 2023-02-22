namespace duice {

    /**
     * MapEvent
     */
    export class MapEvent extends Event {

        /**
         * constructor
         */
        constructor(type: symbol, detail: object) {
            super(type, detail);
        }

    }

}
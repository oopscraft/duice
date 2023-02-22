namespace duice {

    /**
     * ArrayEvent
     */
    export class ArrayEvent extends Event {

        /**
         * constructor
         */
        constructor(type: symbol, detail: object) {
            super(type, detail);
        }

    }

}
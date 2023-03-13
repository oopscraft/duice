namespace duice {

    /**
     * RowDeleteEvent
     */
    export class RowDeleteEvent extends Event {

        index: number;

        /**
         * constructor
         * @param source
         * @param fromIndex
         * @param toIndex
         */
        constructor(source: any, index: number){
            super(source);
            this.index = index;
        }

        /**
         * returns index
         */
        getIndex(): number {
            return this.index;
        }

    }

}
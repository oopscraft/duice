namespace duice.event {

    /**
     * RowDeleteEvent
     */
    export class RowDeleteEvent extends Event {

        index: number;

        rows: object[] = [];

        /**
         * constructor
         * @param source
         * @param index
         */
        constructor(source: any, index: number, rows: object[]){
            super(source);
            this.index = index;
            this.rows = rows;
        }

        /**
         * return index
         */
        getIndex(): number {
            return this.index;
        }

        /**
         * getRows
         */
        getRows(): object[] {
            return this.rows;
        }

    }

}
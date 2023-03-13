namespace duice {

    /**
     * RowAddEvent
     */
    export class RowAddEvent extends Event {

        index: number;

        /**
         * constructor
         * @param source
         * @param index
         */
        constructor(source: any, index: number){
            super(source);
            this.index = index;
        }

        /**
         * return index
         */
        getIndex(): number {
            return this.index;
        }

    }

}
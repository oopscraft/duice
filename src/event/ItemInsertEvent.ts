namespace duice.event {

    /**
     * ItemDeleteEvent
     */
    export class ItemDeleteEvent extends Event {

        index: number;

        items: object[] = [];

        /**
         * constructor
         * @param source
         * @param index
         * @param items
         */
        constructor(source: any, index: number, items: object[]){
            super(source);
            this.index = index;
            this.items = items;
        }

        /**
         * return index
         */
        getIndex(): number {
            return this.index;
        }

        /**
         * get items
         */
        getItems(): object[] {
            return this.items;
        }

    }

}
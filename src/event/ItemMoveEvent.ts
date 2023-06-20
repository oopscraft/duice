///<reference path="Event.ts"/>
namespace duice.event {

    /**
     * ItemMoveEvent
     */
    export class ItemMoveEvent extends Event {

        fromIndex: number;

        toIndex: number;

        /**
         * constructor
         * @param source
         * @param fromIndex
         * @param toIndex
         */
        constructor(source: any, fromIndex: number, toIndex: number){
            super(source);
            this.fromIndex = fromIndex;
            this.toIndex = toIndex;
        }

        /**
         * getFromIndex
         */
        getFromIndex(): number {
            return this.fromIndex;
        }

        /**
         * getToIndex
         */
        getToIndex(): number {
            return this.toIndex;
        }
    }

}
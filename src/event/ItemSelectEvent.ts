///<reference path="Event.ts"/>
namespace duice.event {

    /**
     * ItemSelectEvent
     */
    export class ItemSelectEvent extends Event {

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

        getIndex(): number {
            return this.index;
        }

    }

}
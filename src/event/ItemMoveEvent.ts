///<reference path="Event.ts"/>
namespace duice.event {

    export class ItemMoveEvent extends Event {

        fromIndex: number;

        toIndex: number;

        constructor(source: any, fromIndex: number, toIndex: number){
            super(source);
            this.fromIndex = fromIndex;
            this.toIndex = toIndex;
        }

        getFromIndex(): number {
            return this.fromIndex;
        }

        getToIndex(): number {
            return this.toIndex;
        }
    }

}
///<reference path="Event.ts"/>
namespace duice.event {

    export class ItemSelectEvent extends Event {

        index: number;

        constructor(source: any, index: number){
            super(source);
            this.index = index;
        }

        getIndex(): number {
            return this.index;
        }

    }

}
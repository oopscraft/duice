import {DataEvent} from "./DataEvent";

export class ItemSelectEvent extends DataEvent {

    index: number;

    constructor(source: any, index: number){
        super(source);
        this.index = index;
    }

    getIndex(): number {
        return this.index;
    }

}
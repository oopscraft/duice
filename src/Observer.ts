import {DataEvent} from "./event/DataEvent";
import {Observable} from "./Observable";

export interface Observer {

    update(observable: Observable, dataEvent: DataEvent): void;

}
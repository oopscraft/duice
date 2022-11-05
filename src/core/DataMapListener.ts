import {DataMap} from "./DataMap";

export interface DataMapListener {

    change(dataMap:DataMap):void;

}
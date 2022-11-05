import {DataSet} from "./DataSet";

export interface DataSetListener {

    change(dataSet:DataSet):void;

}
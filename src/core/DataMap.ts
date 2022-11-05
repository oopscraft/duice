import {DataMapListener} from "./DataMapListener";

export class DataMap extends Map {

    listeners:Array<DataMapListener> = new Array<DataMapListener>();

    addListener(listener: DataMapListener): void {
        this.listeners.push(listener);
    }

    notifyListeners(): void {
        this.listeners.forEach(observer =>{
            observer.change(this);
        });
    }

    internalSet(key:string, value:any) {
        super.set(key, value);
    }


}

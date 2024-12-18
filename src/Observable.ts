import {DataEvent} from "./event/DataEvent";
import {Observer} from "./Observer";

export class Observable {

    observers: Observer[] = [];

    notifyEnabled: boolean = true;

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    removeObserver(observer: Observer): void {
        for(let i = 0, size = this.observers.length; i < size; i++){
            if(this.observers[i] === observer){
                this.observers.splice(i,1);
                return;
            }
        }
    }

    suspendNotify(): void {
        this.notifyEnabled = false;
    }

    resumeNotify(): void {
        this.notifyEnabled = true;
    }

    notifyObservers(dataEvent: DataEvent): void {
        if(this.notifyEnabled){
            this.observers.forEach(observer => {
                observer.update(this, dataEvent);
            });
        }
    }

}

/// <reference path="MapComponent.ts" />
namespace duice {

    /**
     * Map data structure
     */
    export class Map extends window.Map<string,any> implements Observer<MapComponent>, Observable<MapComponent> {

        observers: Array<MapComponent> = new Array<MapComponent>();

        /**
         * constructor
         * @param iterator
         */
        constructor(iterator?: any){
            super(iterator);
            console.log("Map.construct", iterator);
        }

        /**
         * setter
         * @param key
         * @param value
         */
        // @ts-ignore
        set(key: string, value: any): void {
           super.set(key, value);
           this.notifyObservers();
        }

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: MapComponent): void {
            this.observers.push(observer);
        }

        /**
         * notifyObservers
         */
        notifyObservers(): void {
            this.observers.forEach(observer => {
                observer.update(this);
            });
        }

        /**
         * update
         * @param observable
         */
        update(observable: MapComponent): void {
            let key = observable.getKey();
            let value = observable.getValue();
            console.log("Map.update", key, value);
            super.set(key, value);
        }

    }

}

///<reference path="Map.ts"/>

namespace duice {

    /**
     * Set data structure
     */
    export class Set extends window.Set<Map> implements Observer<SetComponent>, Observable<SetComponent> {

        observers: Array<SetComponent> = new Array<SetComponent>();

        /**
         * add
         * @param map
         */
        // @ts-ignore
        add(map:Map): void {
            super.add(map);
            //this.notifyChange();
        }

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: SetComponent): void {
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
        update(observable: SetComponent): void {
            console.log("Set.update", observable);
        }

    }
}
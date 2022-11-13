/// <reference path="MapComponent.ts" />
var duice;
(function (duice) {
    /**
     * Map data structure
     */
    class Map extends window.Map {
        /**
         * constructor
         * @param iterator
         */
        constructor(iterator) {
            super(iterator);
            this.observers = new Array();
            console.log("Map.construct", iterator);
        }
        /**
         * setter
         * @param key
         * @param value
         */
        // @ts-ignore
        set(key, value) {
            super.set(key, value);
            this.notifyObservers();
        }
        /**
         * addObserver
         * @param observer
         */
        addObserver(observer) {
            this.observers.push(observer);
        }
        /**
         * notifyObservers
         */
        notifyObservers() {
            this.observers.forEach(observer => {
                observer.update(this);
            });
        }
        /**
         * update
         * @param observable
         */
        update(observable) {
            let key = observable.getKey();
            let value = observable.getValue();
            console.log("Map.update", key, value);
            super.set(key, value);
        }
    }
    duice.Map = Map;
})(duice || (duice = {}));

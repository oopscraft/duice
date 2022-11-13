///<reference path="Map.ts"/>
///<reference path="Observer.ts"/>
///<reference path="Observable.ts"/>
///<reference path="Component.ts"/>
var duice;
(function (duice) {
    /**
     * MapComponent
     */
    class MapComponent extends duice.Component {
        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        constructor(element, context) {
            super(element);
            this.observers = new Array();
            console.log("MapComponent.constructor", element);
            this.map = findObject(context, this.getAttribute("map"));
            this.key = this.getAttribute("key");
            this.addObserver(this.map);
            this.map.addObserver(this);
            this.update(this.map);
        }
        /**
         * addObserver
         * @param observer
         */
        addObserver(observer) {
            this.observers.push(observer);
        }
        /**
         * notifyObserver
         */
        notifyObservers() {
            this.observers.forEach(observer => {
                observer.update(this);
            });
        }
        /**
         * getKey
         */
        getKey() {
            return this.key;
        }
        /**
         * update
         * @param observable
         */
        update(observable) {
            let value = observable.get(this.key);
            this.setValue(value);
        }
    }
    duice.ObjectComponent = MapComponent;
})(duice || (duice = {}));

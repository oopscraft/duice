///<reference path="Map.ts"/>
///<reference path="Observer.ts"/>
///<reference path="Observable.ts"/>
///<reference path="Component.ts"/>

namespace duice {

    /**
     * MapComponent
     */
    export abstract class MapComponent extends Component<Map> implements Observer<Map>, Observable<Map> {

        map: Map;

        key: string;

        observers: Array<Map> = new Array<Map>();

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement, context: any) {
            super(element);
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
        addObserver(observer: Map): void {
            this.observers.push(observer);
        }

        /**
         * notifyObserver
         */
        notifyObservers(): void {
            this.observers.forEach(observer => {
                observer.update(this);
            })
        }

        /**
         * getKey
         */
        getKey(): string {
            return this.key;
        }

        /**
         * update
         * @param observable
         */
        update(observable: Map): void {
            let value = observable.get(this.key);
            this.setValue(value);
        }

        /**
         * setValue
         * @param value
         */
        abstract setValue(value: any): void;

        /**
         * getValue
         */
        abstract getValue(): any;

    }

}

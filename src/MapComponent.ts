///<reference path="Map.ts"/>
///<reference path="Observer.ts"/>
///<reference path="Observable.ts"/>
///<reference path="Component.ts"/>
namespace duice {

    export abstract class MapComponent extends Component<Map> implements Observer<Map>, Observable<Map> {

        map: Map;

        key: string;

        observers: Array<Map> = new Array<Map>();

        protected constructor(element: HTMLElement, context: any) {
            super(element);
            console.log("MapComponent.constructor", element);
            this.map = findObject(context, this.getAttribute("map"));
            this.key = this.getAttribute("key");
            this.addObserver(this.map);
            this.map.addObserver(this);
            this.update(this.map);
        }

        addObserver(observer: Map): void {
            this.observers.push(observer);
        }

        notifyObservers(): void {
            this.observers.forEach(observer => {
                observer.update(this);
            })
        }

        getKey(): string {
            return this.key;
        }

        update(observable: Map): void {
            let value = observable.get(this.key);
            this.setValue(value);
        }

        abstract setValue(value: any): void;

        abstract getValue(): any;

    }

}

///<reference path="Observer.ts"/>
///<reference path="Observable.ts"/>
///<reference path="Component.ts"/>

namespace duice {

    /**
     * ObjectComponent
     */
    export abstract class ObjectComponent extends Component<ObjectHandler> implements Observer<ObjectHandler>, Observable<ObjectHandler> {

        item: object;

        property: string;

        observers: Array<ObjectHandler> = new Array<ObjectHandler>();

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement, context: any) {
            super(element);
            console.log("MapComponent.constructor", element);
            this.item = findObject(context, this.getAttribute("item"));
            this.property = this.getAttribute("property");

            // binds
            console.log(this.item);
            let objectHandler = getProxyHandler(this.item);
            this.addObserver(objectHandler);
            objectHandler.addObserver(this);
            this.update(objectHandler);
        }

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: ObjectHandler): void {
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
         * getProperty
         */
        getProperty(): string {
            return this.property;
        }

        /**
         * update
         * @param observable
         */
        update(observable: ObjectHandler): void {
            let value = observable.getTarget()[this.property];
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

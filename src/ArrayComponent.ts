///<reference path="Observer.ts"/>
///<reference path="Observable.ts"/>
///<reference path="Component.ts"/>

namespace duice {

    /**
     * ArrayComponent
     */
    export abstract class ArrayComponent extends Component<ArrayHandler> implements Observer<ArrayHandler>, Observable<ArrayHandler> {

        items: object[];

        item: string;

        status: string = "status";

        observers: Array<ArrayHandler> = new Array<ArrayHandler>();

        /**
         * constructor
         * @param element
         */
        protected constructor(element: HTMLElement, context: any) {
            super(element);
            console.log("SetComponent.constructor", element);
            this.items = findObject(context, this.getAttribute("items"));
            this.item = this.getAttribute("item");

            // bind
            let arrayHandler = getProxyHandler(this.items);
            this.addObserver(arrayHandler);
            arrayHandler.addObserver(this);
        }

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: ArrayHandler): void {
            this.observers.push(observer);
        }

        /**
         * notifyObservers
         */
        notifyObservers(): void {
            this.observers.forEach(observer => {
                observer.update(this);
            })
        }

        /**
         * getArray
         */
        getArray(): object[] {
            return this.items;
        }

        /**
         * getItem
         */
        getItem(): string {
            return this.item;
        }

        /**
         * getStatus
         */
        getStatus(): string {
            return this.status;
        }

        /**
         * update
         * @param observable
         */
        update(observable: ArrayHandler): void {
            this.setArray(observable.getTarget());
        }

        /**
         * setArray
         * @param array
         */
        abstract setArray(array: object[]);

    }

}
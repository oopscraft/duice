namespace duice {

    /**
     * Handler
     */
    export abstract class Handler<T> implements ProxyHandler<any>, Observer, Observable {

        target: T;

        observers: Component<T>[] = [];

        /**
         * constructor
         * @param target
         * @protected
         */
        protected constructor(target: T) {
            this.target = target;

            // adds handler
            Object.defineProperty(target, "_handler_", {
                value: this,
                writable: false
            });
        }

        /**
         * getTarget
         */
        getTarget(): T {
            return this.target;
        }

        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target: any, property: any, receiver: any): any {
            return Reflect.get(target, property, receiver);
        }

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: Component<T>): void {
            this.observers.push(observer);
        }

        notifyObservers(): void {
            let _this = this;
            this.observers.forEach(observer => {
                console.debug("MapHandler.notifyObservers", observer);
                observer.update(_this);
            });
        }

        abstract update(observable: Observable): void;

    }

}

namespace duice {

    /**
     * Handler
     */
    export abstract class Handler<T> {

        target: T;

        observers: Component<T>[] = [];

        /**
         * constructor
         * @param target
         * @protected
         */
        protected constructor(target: T) {
            console.debug("target:", target);
            this.target = target;
            globalThis.Object.defineProperty(target, "_handler_", {
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
         * addObserver
         * @param component
         */
        addObserver(component: Component<T>): void {
            this.observers.push(component);
        }

        /**
         * notifyObservers
         */
        notifyObservers(detail: object): void {
            this.observers.forEach(observer => {
                observer.update(this, detail);
            });
        }

        /**
         * update
         * @param component
         * @param detail
         */
        abstract update(component: Component<T>, detail: object): void;

    }

}
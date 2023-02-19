namespace duice {

    /**
     * Handler
     */
    export abstract class Handler<T> implements Observer, Observable {

        target: T;

        observers: Component<T>[] = [];

        protected constructor(target: T) {
            this.target = target;

            // adds handler
            Object.defineProperty(target, "_handler_", {
                value: this,
                writable: false
            });
        }

        getTarget(): T {
            return this.target;
        }

        /**
         * getOwnPropertyDescriptor
         * @param target
         * @param prop
         */
        getOwnPropertyDescriptor(target, prop) {
            if(prop == "[[handler]]"){
                return { configurable: true, enumerable: true, value: this };
            }
            return undefined;
        }

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

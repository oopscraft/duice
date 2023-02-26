namespace duice {

    /**
     * Handler
     */
    export abstract class Handler<T> {

        target: T;

        components: Component<T>[] = [];

        /**
         * constructor
         * @param target
         * @protected
         */
        protected constructor(target: T) {
            console.log("target:", target);
            this.target = target;
            globalThis.Object.defineProperty(target, "_handler_", {
                value: this,
                writable: true
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
        addComponent(component: Component<T>): void {
            this.components.push(component);
        }

        /**
         * notifyObservers
         */
        notifyComponents(detail: object): void {
            this.components.forEach(observer => {
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
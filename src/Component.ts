namespace duice {

    /**
     * Component
     */
    export abstract class Component<T> implements Observer, Observable {

        element: HTMLElement;

        observers: Handler<T>[] = [];

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement, context: object) {
            this.element = element;
            this.setAttribute("id", generateUuid());
        }

        /**
         * bind
         * @param handler
         */
        bind(handler: Handler<T>): void {
            this.addObserver(handler);
            handler.addObserver(this);
        }

        /**
         * adds observer
         * @param observer
         */
        addObserver(observer: Handler<T>): void {
            this.observers.push(observer);
        }

        /**
         * notifies observers
         */
        notifyObservers(): void {
            let _this = this;
            this.observers.forEach(observer =>{
                observer.update(_this);
            });
        }

        /**
         * update
         * @param observable
         */
        abstract update(observable: Observable): void;

        /**
         * hasAttribute
         * @param name
         */
        hasAttribute(name: string): boolean {
            return this.element.hasAttribute(`${getAlias()}:${name}`)
        }

        /**
         * getAttribute
         * @param name
         */
        getAttribute(name: string): string {
            return this.element.getAttribute(`${getAlias()}:${name}`);
        }

        /**
         * setAttribute
         * @param name
         * @param value
         */
        setAttribute(name: string, value: string): void {
            this.element.setAttribute(`${getAlias()}:${name}`, value);
        }

    }

}
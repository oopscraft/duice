namespace duice {

    /**
     * Component
     */
    export abstract class Component<T> {

        id: string;

        element: HTMLElement;

        observers: Handler<T>[] = [];

        /**
         * constructor
         * @param element
         * @protected
         */
        protected constructor(element: HTMLElement) {
            this.element = element;
            this.id = generateUuid();
            this.setAttribute("id", this.id);
        }

        /**
         * initialize
         * @param data
         */
        initialize(context: object): void {

            // bind
            let handler = findObject(context, this.getAttribute("bind"))._handler_;
            this.addObserver(handler);
            handler.addObserver(this);

            // call template method
            this.update(handler, {});
        }

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: Handler<T>): void {
            this.observers.push(observer);
        }

        /**
         * notifyObservers
         */
        notifyObservers(detail: object): void {
            for(let i = 0; i < this.observers.length; i++){
                this.observers[i].update(this, detail);
            }
        }

        /**
         * update
         * @param handler
         * @param detail
         */
        abstract update(handler: Handler<T>, detail: object): void;

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
            console.log(this.element, name, value);
            this.element.setAttribute(`${getAlias()}:${name}`, value);
        }

    }

}

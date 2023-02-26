namespace duice {

    /**
     * Component
     */
    export abstract class Component<T> {

        id: string;

        element: HTMLElement;

        handlers: Handler<T>[] = [];

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
         * @param context
         */
        initialize(context: object): void {

            // bind
            let handler = findObject(context, this.getAttribute('bind'))._handler_;
            this.addHandler(handler);
            handler.addComponent(this);

            // initialize
            let data = handler.getTarget();
            this.doInitialize(data);
        }

        /**
         * doInitialize
         * @param data
         */
        abstract doInitialize(data: T): void;

        /**
         * update
         * @param handler
         * @param detail
         */
        update(handler: Handler<T>, detail: object): void {
            let data = handler.getTarget();
            this.doUpdate(data, detail);
        }

        /**
         * doUpdate
         * @param data
         * @param detail
         */
        abstract doUpdate(data: T, detail: object): void;

        /**
         * addHandler
         * @param observer
         */
        addHandler(observer: Handler<T>): void {
            this.handlers.push(observer);
        }

        /**
         * notifyHandlers
         */
        notifyHandlers(detail: object): void {
            for(let i = 0; i < this.handlers.length; i++){
                this.handlers[i].update(this, detail);
            }
        }

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

namespace duice {

    /**
     * component abstract class
     */
    export abstract class Component<T extends HTMLElement> extends Observable implements Observer {

        element: T;

        context: object;

        data: Data;

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: T, context: object) {
            super();
            this.element = element;
            this.context = context;
            setComponentAttribute(this.element, 'id', generateId());
        }

        /**
         * return element
         */
        getElement(): T {
            return this.element;
        }

        /**
         * return context
         */
        getContext(): object {
            return this.context;
        }

        /**
         * set data
         * @param dataName
         */
        setData(dataName: string): void {
            this.data = findVariable(this.context, dataName);
            let dataHandler = globalThis.Object.getOwnPropertyDescriptor(this.data, '_handler_')?.value;
            assert(dataHandler, 'DataHandler is not found');
            this.addObserver(dataHandler);
            dataHandler.addObserver(this);
        }

        /**
         * return data
         */
        getData(): Data {
            return this.data;
        }

        /**
         * executes script if exists
         */
        executeScript(): void {
            let script = getComponentAttribute(this.element, 'script');
            if(script) {
                executeScript(script, this.element, this.context);
            }
        }

        /**
         * render abstract method
         */
        abstract render(): void;

        /**
         * update abstract method
         * @param observable
         * @param event
         */
        abstract update(observable: object, event: event.Event): void;

    }

}
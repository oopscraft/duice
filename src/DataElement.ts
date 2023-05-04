///<reference path="Observable.ts"/>
namespace duice {

    /**
     * element abstract class
     */
    export abstract class DataElement<T extends HTMLElement> extends Observable implements Observer {

        htmlElement: T;

        context: object;

        data: DataProxy;

        /**
         * constructor
         * @param htmlElement
         * @param context
         * @protected
         */
        protected constructor(htmlElement: T, context: object) {
            super();
            this.htmlElement = htmlElement;
            this.context = context;
            setElementAttribute(this.htmlElement, 'id', generateId());
        }

        /**
         * return HTML element
         */
        getHtmlElement(): T {
            return this.htmlElement;
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
        getData(): DataProxy {
            return this.data;
        }

        /**
         * executes script if exists
         */
        executeScript(): void {
            let script = getElementAttribute(this.htmlElement, 'script');
            if(script) {
                executeScript(script, this.htmlElement, this.context);
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
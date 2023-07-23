///<reference path="Observable.ts"/>
namespace duice {

    export abstract class DataElement<T extends HTMLElement, V> extends Observable implements Observer {

        htmlElement: T;

        bindName: string;

        bindData: V;

        context: object;

        protected constructor(htmlElement: T, bindData: V, context: object) {
            super();
            this.htmlElement = htmlElement;
            this.bindData = bindData;
            this.bindName = getElementAttribute(this.htmlElement, 'bind');
            this.context = context;
            setElementAttribute(this.htmlElement, 'id', this.generateId());

            // bind with data handler
            let dataHandler = globalThis.Object.getOwnPropertyDescriptor(bindData, '_handler_')?.value;
            assert(dataHandler, 'DataHandler is not found');
            this.addObserver(dataHandler);
            dataHandler.addObserver(this);

            // set data
            this.bindData = dataHandler.getTarget();
        }

        generateId(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        getHtmlElement(): T {
            return this.htmlElement;
        }

        getBindName(): string {
            return this.bindName;
        }

        getBindData(): V {
            return this.bindData;
        }

        getContext(): object {
            return this.context;
        }

        abstract render(): void;

        abstract update(observable: object, event: event.Event): void;

    }

}
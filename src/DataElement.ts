///<reference path="Observable.ts"/>
namespace duice {

    /**
     * element abstract class
     */
    export abstract class DataElement<T extends HTMLElement, V> extends Observable implements Observer {

        htmlElement: T;

        data: V;

        /**
         * constructor
         * @param htmlElement
         * @param data
         * @protected
         */
        protected constructor(htmlElement: T, data: V) {
            super();
            this.htmlElement = htmlElement;
            this.data = data;
            setElementAttribute(this.htmlElement, 'id', this.generateId());

            // bind with data handler
            let dataHandler = globalThis.Object.getOwnPropertyDescriptor(data, '_handler_')?.value;
            assert(dataHandler, 'DataHandler is not found');
            this.addObserver(dataHandler);
            dataHandler.addObserver(this);

            // set data
            this.data = dataHandler.getTarget();
        }

        /**
         * generates component ID
         */
        generateId(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        /**
         * return HTML element
         */
        getHtmlElement(): T {
            return this.htmlElement;
        }

        /**
         * return data
         */
        getData(): V {
            return this.data;
        }

        /**
         * execute script if exists
         * @param htmlElement
         * @param context
         */
        executeScript(htmlElement: HTMLElement, context: object): void {
            let script = getElementAttribute(htmlElement, 'script');
            if(script) {
                try {
                    let args = [];
                    let values = [];
                    for(let property in context){
                        args.push(property);
                        values.push(context[property]);
                    }
                    return Function(...args, script).call(this.getHtmlElement(), ...values);
                }catch(e){
                    console.error(script, e);
                    throw e;
                }
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
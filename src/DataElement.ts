///<reference path="Observable.ts"/>
namespace duice {

    /**
     * element abstract class
     */
    export abstract class DataElement<T extends HTMLElement, V> extends Observable implements Observer {

        htmlElement: T;

        bindName: string;

        bindData: V;

        context: object;

        /**
         * constructor
         * @param htmlElement
         * @param bindData
         * @param context
         * @protected
         */
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
         * return bind name
         */
        getBindName(): string {
            return this.bindName;
        }

        /**
         * return bind data
         */
        getBindData(): V {
            return this.bindData;
        }

        /**
         * return context
         */
        getContext(): object {
            return this.context;
        }

        // /**
        //  * check if
        //  * @param htmlElement
        //  * @param context
        //  */
        // checkIf(htmlElement: HTMLElement, context: object): boolean {
        //     let ifClause = getElementAttribute(htmlElement, 'if');
        //     if(ifClause) {
        //         try {
        //             let args = [];
        //             let values = [];
        //             for(let property in context){
        //                 args.push(property);
        //                 values.push(context[property]);
        //             }
        //             return Function(...args, ifClause).call(htmlElement, ...values);
        //         }catch(e){
        //             console.error(ifClause, e);
        //         }
        //     }
        //     return true;
        // }
        //
        // /**
        //  * execute script if exists
        //  * @param htmlElement
        //  * @param context
        //  */
        // executeScript(htmlElement: HTMLElement, context: object): void {
        //     let script = getElementAttribute(htmlElement, 'script');
        //     if(script) {
        //         try {
        //             let args = [];
        //             let values = [];
        //             for(let property in context){
        //                 args.push(property);
        //                 values.push(context[property]);
        //             }
        //             return Function(...args, script).call(htmlElement, ...values);
        //         }catch(e){
        //             console.error(script, e);
        //             throw e;
        //         }
        //     }
        // }


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
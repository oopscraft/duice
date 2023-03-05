///<reference path="Observable.ts"/>
namespace duice {

    /**
     * Element
     */
    export abstract class Element<T> extends Observable implements Observer<Handler<T>> {

        id: string;

        htmlElement: HTMLElement;

        handler: Handler<T>;

        /**
         * constructor
         * @param htmlElement
         * @protected
         */
        protected constructor(htmlElement: HTMLElement) {
            super();
            this.htmlElement = htmlElement;
            this.id = this.generateId();
            this.htmlElement.setAttribute(`${getAlias()}:id`, this.id);
        }

        /**
         * Generates component ID
         */
        generateId(): string {
            let dt = new Date().getTime();
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                let r = (dt + Math.random()*16)%16 | 0;
                dt = Math.floor(dt/16);
                return (c=='x' ? r :(r&0x3|0x8)).toString(16);
            });
            return uuid;
        }

        /**
         * get id
         */
        getId(): string {
            return this.id;
        }

        /**
         * gets html element
         */
        getHtmlElement(): HTMLElement {
            return this.htmlElement;
        }

        /**
         * bind
         * @param object
         */
        bind(object: any): void {
            this.handler = object._handler_;
            console.assert(this.handler);
            this.addObserver(this.handler);
            this.handler.addObserver(this);
        }

        /**
         * render
         */
        render(): void {
            let data = this.handler.getTarget();
            this.doRender(data);
        }

        /**
         * doRender
         * @param data
         */
        abstract doRender(data: T): void;

        /**
         * update
         * @param handler
         * @param detail
         */
        update(handler: Handler<T>, detail: object): void {
            let data = this.handler.getTarget();
            this.doUpdate(data, detail);
        }

        /**
         * doUpdate
         * @param data
         * @param detail
         */
        abstract doUpdate(data: T, detail: object): void;

    }
}
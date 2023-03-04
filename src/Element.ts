///<reference path="Observable.ts"/>
namespace duice {

    export class Element<T> extends Observable implements Observer<Handler<T>> {

        id: string;

        htmlElement: HTMLElement;

        handler: Handler<T>;

        property: string;

        constructor(htmlElement: HTMLElement) {
            super();
            this.htmlElement = htmlElement;
            this.id = this.generateId();
            this.setAttribute('id', this.id);
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

        setProperty(property: string): void {
            this.property = property;
        }

        getProperty(): string {
            return this.property;
        }

        /**
         * render
         */
        render(): void {
            // array handler
            if(this.handler instanceof duice.ArrayHandler) {
                this.handler.getTarget().forEach(object => {
                    this.doRender(object);
                });
            }
            // object handler
            if(this.handler instanceof duice.ObjectHandler) {
                this.doRender(this.handler.getTarget());
            }
        }

        /**
         * doRender
         * @param object
         */
        doRender(object: object): void {
            console.warn('== handler', this.handler.getTarget());
            console.log('object', object);
            let value = object[this.getProperty()];
            let textNode = document.createTextNode(value);
            console.warn('textNode', textNode);
            this.htmlElement.insertBefore(textNode, this.htmlElement.firstChild);
        }

        /**
         * update
         * @param handler
         * @param detail
         */
        update(handler: Handler<T>, detail: any): void {
            console.log("Element.update", handler, detail);
            this.render();
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
         * hasAttribute
         * @param name
         */
        hasAttribute(name: string): boolean {
            return this.htmlElement.hasAttribute(`${getAlias()}:${name}`)
        }

        /**
         * getAttribute
         * @param name
         */
        getAttribute(name: string): string {
            return this.htmlElement.getAttribute(`${getAlias()}:${name}`);
        }

        /**
         * setAttribute
         * @param name
         * @param value
         */
        setAttribute(name: string, value: string): void {
            this.htmlElement.setAttribute(`${getAlias()}:${name}`, value);
        }


    }
}
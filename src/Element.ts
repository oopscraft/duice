///<reference path="Observable.ts"/>
///<reference path="mask/MaskFactory.ts"/>
namespace duice {

    /**
     * Element
     */
    export abstract class Element<T extends HTMLElement> extends Observable implements Observer {

        slotElement: HTMLSlotElement = document.createElement('slot');

        htmlElement: T;

        context: object;

        objectProxy: ObjectProxy;

        property: string;

        mask: Mask;

        /**
         * constructor
         * @param htmlElement
         * @protected
         */
        protected constructor(htmlElement: T, context: object) {
            super();

            // clone html element template
            this.htmlElement = htmlElement.cloneNode(true) as T;
            setAttribute(this.htmlElement, 'id', generateId());
            markInitialized(htmlElement);

            // replace slot element
            htmlElement.replaceWith(this.slotElement);

            // set context
            this.context = context;
        }

        /**
         * setData
         * @param objectName
         */
        setObject(objectName: string): void {
            this.objectProxy = findObject(this.context, objectName);
            if(!this.objectProxy){
                console.warn(`ObjectProxy[${objectName}] is not found.`, this.objectProxy);
                this.objectProxy = new ObjectProxy({});
            }
            let objectHandler = ObjectProxy.getHandler(this.objectProxy);
            this.addObserver(objectHandler);
            objectHandler.addObserver(this);
        }

        /**
         * gets html element
         */
        getHtmlElement(): T {
            return this.htmlElement;
        }

        /**
         * set property
         * @param property
         */
        setProperty(property: string): void {
            this.property = property;
        }

        /**
         * get property
         */
        getProperty(): string {
            return this.property;
        }

        /**
         * set mask
         * @param mask string from html mask attribute
         */
        setMask(mask: string): void {
            this.mask = MaskFactory.getMask(mask);
        }

        /**
         * returns mask
         */
        getMask(): Mask {
            return this.mask;
        }

        /**
         * render
         */
        render(): void {
            if(this.property){
                let objectHandler = ObjectProxy.getHandler(this.objectProxy);

                // set value
                let value = objectHandler.getValue(this.property);
                this.setValue(value);
            }

            // executes script
            this.executeScript();

            // append to slot element
            this.slotElement.appendChild(this.htmlElement);
        }

        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: Event): void {
            console.log('Element.update', observable, event);

            // ObjectHandler
            if(observable instanceof ObjectHandler) {
                if(this.property){
                    // set value
                    this.setValue(observable.getValue(this.property));
                }

                // executes script
                this.executeScript();
            }
        }

        /**
         * setValue
         * @param value
         */
        abstract setValue(value: any): void;

        /**
         * getValue
         */
        abstract getValue(): any;

        /**
         * executes script
         */
        executeScript(): void {
            let script = getAttribute(this.getHtmlElement(), 'script');
            if(script) {
                executeScript(script, this.getHtmlElement(), this.context);
            }
        }

        /**
         * getIndex
         */
        getIndex(): number {
            let index = getAttribute(this.htmlElement, 'index');
            if(index){
                return Number(index);
            }
        }

        /**
         * setReadonly
         * @param readonly
         */
        abstract setReadonly(readonly: boolean): void;

    }

}
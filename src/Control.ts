///<reference path="Observable.ts"/>
///<reference path="./mask/MaskFactory.ts"/>
namespace duice {

    /**
     * Control
     */
    export abstract class Control<T extends HTMLElement> extends Observable implements Observer {

        slot: HTMLSlotElement = document.createElement('slot');

        element: T;

        context: object;

        objectProxy: ObjectProxy;

        property: string;

        mask: Mask;

        /**
         * constructor
         * @param element
         * @protected
         */
        protected constructor(element: T, context: object) {
            super();

            // clone html element template
            this.element = element;
            setAttribute(this.element, 'id', generateId());
            markInitialized(this.element);

            // replace slot element
            element.replaceWith(this.slot);

            // set context
            this.context = context;
        }

        /**
         * set object
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
         * returns element
         */
        getElement(): T {
            return this.element;
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

                // set readonly
                let readonly = objectHandler.isReadonly(this.property);
                this.setReadonly(readonly);
            }

            // executes script
            this.executeScript();

            // replace to slot element
            this.slot.replaceWith(this.element);
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

                    // set readonly
                    this.setReadonly(observable.isReadonly(this.property));
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
            let script = getAttribute(this.getElement(), 'script');
            if(script) {
                executeScript(script, this.getElement(), this.context);
            }
        }

        /**
         * getIndex
         */
        getIndex(): number {
            let index = getAttribute(this.element, 'index');
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
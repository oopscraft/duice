///<reference path="Observable.ts"/>
///<reference path="mask/MaskFactory.ts"/>
namespace duice {

    /**
     * Element
     */
    export abstract class Element<T extends HTMLElement> extends Observable implements Observer {

        id: string;

        htmlElement: T;

        context: object;

        objectHandler: ObjectHandler;

        property: string;

        mask: Mask;

        /**
         * constructor
         * @param htmlElement
         * @protected
         */
        protected constructor(htmlElement: T, context: object) {
            super();
            this.htmlElement = htmlElement;
            this.context = context;
            this.id = generateUuid();
            setAttribute(this.htmlElement, 'id', this.id);
        }

        /**
         * setData
         * @param objectName
         */
        setObject(objectName: string): void {
            let object = findObject(this.context, objectName);
            assert(object, `ObjectProxy[${objectName}] is not found.`)
            this.objectHandler = ObjectProxy.getHandler(object);
            this.addObserver(this.objectHandler);
            this.objectHandler.addObserver(this);
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

                // set value
                this.setValue(this.objectHandler.getValue(this.property));

                // set readonly
                let readonly = this.objectHandler.isReadonly(this.property);
                this.setReadonly(readonly);
            }

            // executes script
            this.executeScript();
        }

        /**
         * update
         * @param objectHandler
         * @param detail
         */
        update(objectHandler: ObjectHandler, detail: object): void {

            if(this.property){

                // set value
                this.setValue(objectHandler.getValue(this.property));

                // set readonly
                let readonly = this.objectHandler.isReadonly(this.property);
                this.setReadonly(readonly);
            }

            // executes script
            this.executeScript();
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
         * getIndex
         */
        getIndex(): number {
            let index = getAttribute(this.htmlElement, 'index');
            if(index){
                return Number(index);
            }
        }

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
         * setReadonly
         * @param readonly
         */
        abstract setReadonly(readonly: boolean): void;

    }

}
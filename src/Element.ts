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

        dataHandler: DataHandler;

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
         * @param data
         */
        setData(data: string): void {
            let dataObject = findObject(this.context, data);
            this.dataHandler = Data.getHandler(dataObject);
            console.assert(this.dataHandler);
            this.addObserver(this.dataHandler);
            this.dataHandler.addObserver(this);
        }

        /**
         * returns bind data handler
         */
        getDataHandler(): DataHandler {
            return this.dataHandler;
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
                this.setValue(this.dataHandler.getValue(this.property));

                // set readonly
                let readonly = this.dataHandler.isReadonly(this.property);
                this.setReadonly(readonly);
            }

            // executes script
            this.executeScript();
        }

        /**
         * update
         * @param dataHandler
         * @param detail
         */
        update(dataHandler: DataHandler, detail: object): void {

            if(this.property){

                // set value
                this.setValue(dataHandler.getValue(this.property));

                // set readonly
                let readonly = this.dataHandler.isReadonly(this.property);
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
///<reference path="Observable.ts"/>
namespace duice {

    import MaskFactory = duice.mask.MaskFactory;
    import Mask = duice.mask.Mask;

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
         * getDataHandler
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
         * setMask
         * @param mask
         */
        setMask(mask: string): void {
            this.mask = MaskFactory.getMask(mask);
        }

        /**
         * getMask
         */
        getMask(): duice.mask.Mask {
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
        setValue(value: any): void {
            value = this.getMask() ? this.getMask().encode(value) : value;
            this.doSetValue(value);
        }

        /**
         * doSetValue
         * @param value
         */
        abstract doSetValue(value: any): void;

        /**
         * getValue
         */
        getValue(): any {
            let value = this.doGetValue();
            value = this.getMask() ? this.getMask().decode(value) : value;
            return value;
        }

        /**
         * doGetValue
         */
        abstract doGetValue(): any;

        /**
         * checkBeforeChange
         * @param event
         */
        checkBeforeChange(event: any): void {
            let value = event.target['value'];
            if(this.dataHandler.callBeforeChangeListener(this.property, value) === false){
                this.setValue(this.dataHandler.getValue(this.property));
                throw new Error('before change listener returns false');
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
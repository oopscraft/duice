///<reference path="Observable.ts"/>
namespace duice {

    import MaskFactory = duice.mask.MaskFactory;
    import Mask = duice.mask.Mask;

    /**
     * Element
     */
    export abstract class Element extends Observable implements Observer {

        id: string;

        htmlElement: HTMLElement;

        context: object;

        dataHandler: DataHandler;

        property: string;

        mask: Mask;

        /**
         * constructor
         * @param htmlElement
         * @protected
         */
        protected constructor(htmlElement: HTMLElement, context: object) {
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
            this.dataHandler = Object.getOwnPropertyDescriptor(dataObject, '_handler_').value;
            console.assert(this.dataHandler);
            this.addObserver(this.dataHandler);
            this.dataHandler.addObserver(this);
        }

        /**
         * gets html element
         */
        getHtmlElement(): HTMLElement {
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
            let data = this.dataHandler.getData();
            this.doRender(data);
        }

        /**
         * doRender
         * @param data
         */
        abstract doRender(data: object): void;

        /**
         * update
         * @param dataHandler
         * @param detail
         */
        update(dataHandler: DataHandler, detail: object): void {
            let data = this.dataHandler.getData();
            this.doUpdate(data, detail);
        }

        /**
         * doUpdate
         * @param data
         * @param detail
         */
        abstract doUpdate(data: object, detail: object): void;

        /**
         * setValue
         */
        abstract getValue(): any;


    }
}
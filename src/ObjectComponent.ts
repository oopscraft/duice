namespace duice {

    /**
     * ObjectComponent
     */
    export class ObjectComponent extends Component<object> {

        handler: ObjectHandler;

        mask: mask.Mask<any>;

        /**
         * create
         * @param element
         * @param context
         */
        static create(element: HTMLElement, context: object): ObjectComponent {
            return new ObjectComponent(element, context);
        }

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLElement, context: object) {
            super(element, context);

            // object handler
            let objectName = this.getAttribute(this.element, 'object');
            let object = this.findObject(objectName);
            this.handler = object._handler_;
            this.handler.addComponent(this);

            // mask
            if(this.hasAttribute(this.element, 'mask')){
                let mask = this.getAttribute(this.element, 'mask');
                this.mask = duice.mask.MaskFactory.getMask(mask);
            }
        }

        /**
         * getProperty
         */
        getProperty(): string {
            return this.getAttribute(this.element, 'property');
        }

        /**
         * render
         */
        override doRender(): void {

            // process property
            let property = this.getProperty();
            if(property) {
                let value = this.handler.getPropertyValue(property);
                value = this.mask ? this.mask.encode(value) : value;
                let textNode = document.createTextNode(value);
                this.element.insertBefore(textNode, this.element.firstChild);
            }

            // append to stage
            this.appendToStage(this.element);
        }

       /**
         * update
         * @param detail
         */
        override doUpdate(detail: object): void {
            this.render();
        }

        /**
         * getValue
         */
        getValue(): any {
            let value = this.element.firstChild.textContent;
            return this.mask ? this.mask.decode(value) : value;
        }

    }

}

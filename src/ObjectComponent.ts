namespace duice {

    /**
     * ObjectComponent
     */
    export class ObjectComponent extends Component<object> {

        handler: ObjectHandler;

        property: string;
        
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

            // property
            this.property = this.getAttribute(this.element, "property");

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
            return this.property;
        }

        /**
         * render
         */
        doRender(): void {
            let value = this.handler.getPropertyValue(this.getProperty());
            value = this.mask ? this.mask.encode(value) : value;
            let textNode = document.createTextNode(value);
            this.element.insertBefore(textNode, this.element.firstChild);
        }

       /**
         * update
         * @param detail
         */
        doUpdate(detail: object): void {
            this.doRender();
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

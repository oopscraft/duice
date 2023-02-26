namespace duice {

    /**
     * ObjectComponent
     */
    export abstract class ObjectComponent extends Component<object> {

        property: string;

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement) {
            super(element);
            this.property = this.getAttribute("property");
        }

        /**
         * getProperty
         */
        getProperty(): string {
            return this.property;
        }

        /**
         * doInitialize
         * @param object
         */
        override doInitialize(object: object): void {
            this.doUpdate(object, {});
        }

        /**
         * doUpdate
         * @param object
         * @param detail
         */
        override doUpdate(object: object, detail: object): void {
            let value = object[this.property];
            this.setValue(value);
        }

        /**
         * setValue
         * @param value
         */
        abstract setValue(value: any): boolean;

        /**
         * getValue
         */
        abstract getValue(): any;

        /**
         * setReadOnly
         */
        abstract setReadOnly(readOnly: boolean): void;

    }

}

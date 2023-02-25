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
         * update
         * @param object
         */
        update(objectHandler: ObjectHandler, detail: object): void {
            let value = objectHandler.getTarget()[this.property];
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

    }

}

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
         * getValue
         */
        abstract getValue(): any;

    }

}

namespace duice.component {

    /**
     * select element factory class
     */
    export class SelectElementFactory extends ObjectElementFactory<HTMLSelectElement> {

        /**
         * create component
         * @param element
         * @param context
         */
        override doCreateElement(element: HTMLSelectElement, context: object): SelectElement {
            return new SelectElement(element, context);
        }

        /**
         * return supported
         * @param element
         */
        override doSupport(element: HTMLElement): boolean {
            return (element.tagName.toLowerCase() === 'select');
        }

    }

    // register factory instance
    ObjectElementFactory.addInstance(new SelectElementFactory());

}
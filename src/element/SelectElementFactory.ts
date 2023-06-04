namespace duice.component {

    /**
     * select element factory class
     */
    export class SelectElementFactory extends ObjectElementFactory<HTMLSelectElement> {

        /**
         * create component
         * @param element
         * @param bindData
         * @param context
         */
        override doCreateElement(element: HTMLSelectElement, bindData: object, context: object): SelectElement {
            return new SelectElement(element, bindData, context);
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
    ObjectElementFactoryRegistry.addInstance(new SelectElementFactory());

}
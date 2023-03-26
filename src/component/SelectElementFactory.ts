namespace duice {

    /**
     * select element factory class
     */
    export class SelectElementFactory extends ObjectComponentFactory<HTMLSelectElement> {

        /**
         * create component
         * @param element
         * @param context
         */
        override doCreateComponent(element: HTMLSelectElement, context: object): SelectElement {
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
    ObjectComponentFactory.addInstance(new SelectElementFactory());

}
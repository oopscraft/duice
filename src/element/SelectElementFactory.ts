namespace duice.element {

    /**
     * SelectElementFactory
     */
    export class SelectElementFactory extends ElementFactory<SelectElement> {

        /**
         * doCreateElement
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement: HTMLSelectElement, context: object): SelectElement {
            return new SelectElement(htmlElement, context);
        }

        /**
         * support
         * @param htmlElement
         */
        support(htmlElement: HTMLElement): boolean {
            return (htmlElement.tagName.toLowerCase() === 'select');
        }

    }

    // register
    ElementFactory.registerElementFactory(new SelectElementFactory());

}
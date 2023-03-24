namespace duice {

    /**
     * SelectElementControlFactory
     */
    export class SelectElementControlFactory extends ElementControlFactory<SelectElementControl> {

        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLSelectElement, context: object): SelectElementControl {
            return new SelectElementControl(element, context);
        }

        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean {
            return (element.tagName.toLowerCase() === 'select');
        }

    }

    // register
    ElementControlFactory.registerControlFactory(new SelectElementControlFactory());

}
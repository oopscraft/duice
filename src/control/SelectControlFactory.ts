namespace duice {

    /**
     * SelectElementFactory
     */
    export class SelectControlFactory extends ControlFactory<SelectControl> {

        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLSelectElement, context: object): SelectControl {
            return new SelectControl(element, context);
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
    ControlFactory.registerControlFactory(new SelectControlFactory());

}
namespace duice.element {

    /**
     * GenericElementFactory
     */
    export class GenericElementFactory extends ElementFactory<GenericElement> {

        /**
         * doCreateElement
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement: HTMLElement, context: object): GenericElement {
            return new GenericElement(htmlElement, context);
        }

        /**
         * support
         * @param htmlElement
         */
        support(htmlElement: HTMLElement): boolean {
            return true;
        }

    }

}
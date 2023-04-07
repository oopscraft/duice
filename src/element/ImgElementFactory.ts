namespace duice.component {

    /**
     * image element factory class
     */
    export class ImageElementFactory extends ObjectElementFactory<HTMLImageElement> {

        /**
         * creates component
         * @param element
         * @param context
         */
        override doCreateElement(element: HTMLImageElement, context: object): ImageElement {
            return new ImageElement(element, context);
        }

        /**
         * returns supported
         * @param element
         */
        override doSupport(element: HTMLElement): boolean {
            return (element.tagName.toLowerCase() === 'img');
        }

    }

    // register factory instance
    ObjectElementFactory.addInstance(new ImageElementFactory());

}
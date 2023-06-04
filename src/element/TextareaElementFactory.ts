namespace duice.component {

    /**
     * textarea element factory class
     */
    export class TextareaElementFactory extends ObjectElementFactory<HTMLTextAreaElement> {

        /**
         * creates component
         * @param element
         * @param bindData
         * @param context
         */
        override doCreateElement(element: HTMLTextAreaElement, bindData: object, context: object): TextareaElement {
            return new TextareaElement(element, bindData, context);
        }

        /**
         * returns supported
         * @param element
         */
        override doSupport(element: HTMLElement): boolean {
            return (element.tagName.toLowerCase() === 'textarea');
        }

    }

    // register factory instance
    ObjectElementFactoryRegistry.addInstance(new TextareaElementFactory());

}
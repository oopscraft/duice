namespace duice.component {

    /**
     * textarea element factory class
      */
    export class TextareaElementFactory extends ObjectComponentFactory<HTMLTextAreaElement> {

        /**
         * creates component
         * @param element
         * @param context
         */
        override doCreateComponent(element: HTMLTextAreaElement, context: object): TextareaElement {
            return new TextareaElement(element, context);
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
    ObjectComponentFactory.addInstance(new TextareaElementFactory());

}
namespace duice.element {

    /**
     * TextareaElementFactory
     */
    export class TextareaElementFactory extends ElementFactory<TextareaElement> {

        /**
         * doCreateElement
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement: HTMLTextAreaElement, context: object): TextareaElement {
            return new TextareaElement(htmlElement, context);
        }

        /**
         * support
         * @param htmlElement
         */
        support(htmlElement: HTMLElement): boolean {
            return (htmlElement.tagName.toLowerCase() === 'textarea');
        }

    }

    // register
    ElementFactory.registerElementFactory(new TextareaElementFactory());

}
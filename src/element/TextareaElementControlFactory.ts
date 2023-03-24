namespace duice {

    /**
     * TextareaElementControlFactory
     */
    export class TextareaElementControlFactory extends ElementControlFactory<TextareaElementControl> {

        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLTextAreaElement, context: object): TextareaElementControl {
            return new TextareaElementControl(element, context);
        }

        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean {
            return (element.tagName.toLowerCase() === 'textarea');
        }

    }

    // register
    ElementControlFactory.registerControlFactory(new TextareaElementControlFactory());

}
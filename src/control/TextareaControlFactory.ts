namespace duice {

    /**
     * TextareaElementFactory
     */
    export class TextareaControlFactory extends ControlFactory<TextareaControl> {

        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLTextAreaElement, context: object): TextareaControl {
            return new TextareaControl(element, context);
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
    ControlFactory.registerControlFactory(new TextareaControlFactory());

}
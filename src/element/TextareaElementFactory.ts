///<reference path="../DataElementRegistry.ts"/>
namespace duice.element {

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

    }

    // register
    DataElementRegistry.register('textarea', new TextareaElementFactory());

}
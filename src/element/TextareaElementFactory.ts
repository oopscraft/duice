///<reference path="../DataElementRegistry.ts"/>
namespace duice.element {

    export class TextareaElementFactory extends ObjectElementFactory<HTMLTextAreaElement> {

        override createElement(element: HTMLTextAreaElement, bindData: object, context: object): TextareaElement {
            return new TextareaElement(element, bindData, context);
        }

    }

    // register
    DataElementRegistry.register('textarea', new TextareaElementFactory());

}
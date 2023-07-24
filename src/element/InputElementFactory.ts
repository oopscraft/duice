///<reference path="../DataElementRegistry.ts"/>
namespace duice.element {

    export class InputElementFactory extends ObjectElementFactory<HTMLInputElement> {

        override createElement(element: HTMLInputElement, bindData: object, context: object): InputElement {
            let type = element.getAttribute('type');
            switch(type) {
                case 'number':
                    return new InputNumberElement(element, bindData, context);
                case 'checkbox':
                    return new InputCheckboxElement(element, bindData, context);
                case 'radio':
                    return new InputRadioElement(element, bindData, context);
                case 'datetime-local':
                    return new InputDatetimeLocalElement(element, bindData, context);
                default:
                    return new InputElement(element, bindData, context);
            }
        }

    }

    // register factory instance
    DataElementRegistry.register('input', new InputElementFactory());

}
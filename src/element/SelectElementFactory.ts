///<reference path="../DataElementRegistry.ts"/>
namespace duice.element {

    export class SelectElementFactory extends ObjectElementFactory<HTMLSelectElement> {

        override doCreateElement(element: HTMLSelectElement, bindData: object, context: object): SelectElement {
            return new SelectElement(element, bindData, context);
        }

    }

    // register factory instance
    DataElementRegistry.register('select', new SelectElementFactory());

}
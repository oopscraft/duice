///<reference path="../DataElementRegistry.ts"/>
namespace duice.component {

    /**
     * select element factory class
     */
    export class SelectElementFactory extends ObjectElementFactory<HTMLSelectElement> {

        /**
         * create component
         * @param element
         * @param bindData
         * @param context
         */
        override doCreateElement(element: HTMLSelectElement, bindData: object, context: object): SelectElement {
            return new SelectElement(element, bindData, context);
        }

    }

    // register factory instance
    DataElementRegistry.register('select', new SelectElementFactory());

}
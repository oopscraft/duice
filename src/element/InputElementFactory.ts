namespace duice.component {

    /**
     * input element factory class
     */
    export class InputElementFactory extends ObjectElementFactory<HTMLInputElement> {

        /**
         * creates component
         * @param element
         * @param bindData
         * @param context
         */
        override doCreateElement(element: HTMLInputElement, bindData: object, context: object): InputElement {
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

        /**
         * check supported
         * @param element
         */
        override doSupport(element: HTMLElement): boolean {
            return (element.tagName.toLowerCase() === 'input');
        }

    }

    // register factory instance
    ObjectElementFactoryRegistry.addInstance(new InputElementFactory());

}
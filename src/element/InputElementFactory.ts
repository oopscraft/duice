namespace duice.component {

    /**
     * input element factory class
     */
    export class InputElementFactory extends ObjectElementFactory<HTMLInputElement> {

        /**
         * creates component
         * @param element
         * @param context
         */
        override doCreateElement(element: HTMLInputElement, context: object): InputElement {
            let type = element.getAttribute('type');
            switch(type) {
                case 'number':
                    return new InputNumberElement(element, context);
                case 'checkbox':
                    return new InputCheckboxElement(element, context);
                case 'radio':
                    return new InputRadioElement(element, context);
                case 'datetime-local':
                    return new InputDatetimeLocalElement(element, context);
                default:
                    return new InputElement(element, context);
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
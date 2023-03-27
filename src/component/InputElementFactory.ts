namespace duice.component {

    /**
     * input element factory class
     */
    export class InputElementFactory extends ObjectComponentFactory<HTMLInputElement> {

        /**
         * creates component
         * @param element
         * @param context
         */
        override doCreateComponent(element: HTMLInputElement, context: object): InputElement {
            let type = element.getAttribute('type');
            switch(type) {
                case 'number':
                    return new InputNumberElement(element, context);
                case 'checkbox':
                    return new InputCheckboxElement(element, context);
                case 'radio':
                    return new InputRadioElement(element, context);
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
    ObjectComponentFactory.addInstance(new InputElementFactory());

}
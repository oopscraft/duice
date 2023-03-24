namespace duice {

    /**
     * InputElementControlFactory
     */
    export class InputElementControlFactory extends ElementControlFactory<InputElementControl> {

        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLInputElement, context: object): InputElementControl {
            let type = element.getAttribute('type');
            switch(type) {
                case 'number':
                    return new InputNumberElementControl(element, context);
                case 'checkbox':
                    return new InputCheckboxElementControl(element, context);
                case 'radio':
                    return new InputRadioElementControl(element, context);
                default:
                    return new InputElementControl(element, context);
            }
        }

        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean {
            if(element.tagName.toLowerCase() === 'input'){
                return true;
            }else{
                return false;
            }
        }

    }

    // register
    ElementControlFactory.registerControlFactory(new InputElementControlFactory());

}
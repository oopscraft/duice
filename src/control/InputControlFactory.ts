namespace duice {

    /**
     * InputElementFactory
     */
    export class InputControlFactory extends ControlFactory<InputControl> {

        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLInputElement, context: object): InputControl {
            let type = element.getAttribute('type');
            switch(type) {
                case 'number':
                    return new InputNumberControl(element, context);
                case 'checkbox':
                    return new InputCheckboxControl(element, context);
                case 'radio':
                    return new InputRadioControl(element, context);
                default:
                    return new InputControl(element, context);
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
    ControlFactory.registerControlFactory(new InputControlFactory());

}
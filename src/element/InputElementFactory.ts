namespace duice.element {

    /**
     * InputElementFactory
     */
    export class InputElementFactory extends ElementFactory<InputElement> {

        /**
         * doCreateElement
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement: HTMLInputElement, context: object): InputElement {
            let type = htmlElement.getAttribute('type');
            switch(type) {
                case 'number':
                    return new InputNumberElement(htmlElement, context);
                case 'checkbox':
                    return new InputCheckboxElement(htmlElement, context);
                default:
                    return new InputElement(htmlElement, context);
            }
        }

        /**
         * support
         * @param htmlElement
         */
        support(htmlElement: HTMLElement): boolean {
            if(htmlElement.tagName.toLowerCase() === 'input'){
                return true;
            }else{
                return false;
            }
        }

    }

    // register
    ElementFactory.registerElementFactory(new InputElementFactory());

}
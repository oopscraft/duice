namespace duice {

    /**
     * ObjectElementFactory
     */
    export class ObjectElementFactory extends ElementFactory<ObjectElement> {

        /**
         * creates element
         * @param htmlElement
         * @param bindObject
         */
        createElement(htmlElement: HTMLElement, context: object): ObjectElement {
            let element = new ObjectElement(htmlElement);

            // bind
            let bindAttribute = getAttribute(htmlElement, 'bind');
            let bindObject = findObject(context, bindAttribute);
            element.bind(bindObject);

            // property
            if(hasAttribute(htmlElement, 'property')){
                element.setProperty(getAttribute(htmlElement, 'property'));
            }

            // returns
            return element;
        }

    }

}
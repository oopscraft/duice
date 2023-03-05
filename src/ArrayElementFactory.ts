namespace duice {

    /**
     * ArrayElementFactory
     */
    export class ArrayElementFactory extends ElementFactory<ArrayElement> {

        /**
         * creates element
         * @param htmlElement
         * @param context
         */
        createElement(htmlElement: HTMLElement, context: object): ArrayElement {
            let element = new ArrayElement(htmlElement);

            // bind
            let bindAttribute = getAttribute(htmlElement, 'bind');
            let bindObject = findObject(context, bindAttribute);
            element.bind(bindObject);

            // loop
            if(hasAttribute(htmlElement, 'loop')){
                element.setLoop(getAttribute(htmlElement, 'loop'));
            }

            // returns
            return element;
        }

    }

}
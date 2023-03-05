namespace duice {

    /**
     * ElementFactory
     */
    export abstract class ElementFactory<T> {

        /**
         * return factory instance
         * @param htmlElement
         * @param context
         */
        static getInstance(htmlElement: HTMLElement, context: object): ElementFactory<any> {
            let bindAttribute = getAttribute(htmlElement, 'bind');
            let bindObject = findObject(context, bindAttribute);
            console.assert(bindObject, `bind[${bindAttribute}] object is null`);
            if(bindObject instanceof DataSet){
                return new ArrayElementFactory();
            }else{
                return new ObjectElementFactory();
            }
        }

        /**
         * creates element
         * @param htmlElement
         * @param context
         */
        abstract createElement(htmlElement: HTMLElement, context: object): T;

    }

}
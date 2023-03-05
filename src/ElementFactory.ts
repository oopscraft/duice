namespace duice {

    /**
     * ElementFactory
     */
    export abstract class ElementFactory {

        static elementFactoryRegistry: ElementFactory[] = [];

        /**
         * registerElementFactory
         * @param elementFactory
         */
        static registerElementFactory(elementFactory: ElementFactory): void {
            this.elementFactoryRegistry.push(elementFactory);
        }

        /**
         * get instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ElementFactory {
            let instance;
            this.elementFactoryRegistry.forEach(elementFactory => {
                if(elementFactory.support(htmlElement)){
                    instance = elementFactory;
                }
            });
            if(instance){
                return instance;
            }else{
                return new element.GenericElementFactory();
            }
        }

        /**
         * creates element
         * @param htmlElement
         * @param context
         */
        createElement(htmlElement: HTMLElement, context: object): Element {

            // creates element
            let element = this.doCreateElement(htmlElement, context);

            // data
            let data = getAttribute(htmlElement, 'data');
            element.setData(data);

            // property
            let property = getAttribute(htmlElement, 'property');
            if (property) {
                element.setProperty(property);
            }

            // mask
            let mask = getAttribute(htmlElement, 'mask');
            if (mask) {
                element.setMask(mask);
            }

            // returns
            return element;
        }

        /**
         * support
         * @param htmlElement
         */
        abstract support(htmlElement: HTMLElement): boolean;

        /**
         * doCreateElement
         * @param htmlElement
         * @param context
         */
        abstract doCreateElement(htmlElement: HTMLElement, context: object): Element;

    }

}
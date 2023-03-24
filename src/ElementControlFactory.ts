namespace duice {

    /**
     * ElementControlFactory
     */
    export abstract class ElementControlFactory<T extends ElementControl<any>> {

        static controlFactoryRegistry: ElementControlFactory<ElementControl<any>>[] = [];

        /**
         * register control factory
         * @param controlFactory
         */
        static registerControlFactory(controlFactory: ElementControlFactory<ElementControl<any>>): void {
            this.controlFactoryRegistry.push(controlFactory);
        }

        /**
         * getSelectors
         */
        static getQuerySelectors(): string[] {
            return [`*[${getNamespace()}\\:object]:not([${getNamespace()}\\:id])`];
        }

        /**
         * get instance
         * @param element
         */
        static getInstance(element: HTMLElement): ElementControlFactory<ElementControl<any>> {
            let instance;
            this.controlFactoryRegistry.forEach(controlFactory => {
                if(controlFactory.support(element)){
                    instance = controlFactory;
                }
            });
            if(instance){
                return instance;
            }else{
                return new GenericElementControlFactory();
            }
        }

        /**
         * creates element control
         * @param element
         * @param context
         */
        createElementControl(element: HTMLElement, context: object): ElementControl<any> {

            // creates element
            let control = this.doCreateControl(element, context);

            // object
            let object = getAttribute(element, 'object');
            control.setObject(object);

            // property
            let property = getAttribute(element, 'property');
            if (property) {
                control.setProperty(property);
            }

            // mask
            let mask = getAttribute(element, 'mask');
            if (mask) {
                control.setMask(mask);
            }

            // returns
            return control;
        }

        /**
         * support
         * @param element
         */
        abstract support(element: HTMLElement): boolean;

        /**
         * doCreateControl
         * @param element
         * @param context
         */
        abstract doCreateControl(element: HTMLElement, context: object): ElementControl<any>;

    }

}
namespace duice {

    /**
     * ElementFactory
     */
    export abstract class ControlFactory<T extends Control<any>> {

        static controlFactoryRegistry: ControlFactory<Control<any>>[] = [];

        /**
         * register control factory
         * @param controlFactory
         */
        static registerControlFactory(controlFactory: ControlFactory<Control<any>>): void {
            this.controlFactoryRegistry.push(controlFactory);
        }

        /**
         * get instance
         * @param element
         */
        static getInstance(element: HTMLElement): ControlFactory<Control<any>> {
            let instance;
            this.controlFactoryRegistry.forEach(controlFactory => {
                if(controlFactory.support(element)){
                    instance = controlFactory;
                }
            });
            if(instance){
                return instance;
            }else{
                return new GenericControlFactory();
            }
        }

        /**
         * creates control
         * @param element
         * @param context
         */
        createControl(element: HTMLElement, context: object): Control<any> {

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
        abstract doCreateControl(element: HTMLElement, context: object): Control<any>;

    }

}
namespace duice {

    export abstract class ComponentControlFactory {

        static componentFactoryRegistry: ComponentControlFactory[] = [];

        /**
         * register component factory
         * @param componentFactory
         */
        static registerComponentFactory(componentFactory: ComponentControlFactory): void {
            this.componentFactoryRegistry.push(componentFactory);
        }

        /**
         * return instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ComponentControlFactory {
            let instance;
            this.componentFactoryRegistry.forEach(componentFactory => {
                if (componentFactory.support(htmlElement)) {
                    instance = componentFactory;
                }
            });
            return instance;
        }

        /**
         * creates element
         * @param element
         * @param context
         */
        createComponentControl(element: Component, context: object): ComponentControl<Component> {

            // creates instance
            let componentControl = new ComponentControl(element, context);

            // object
            let objectName = getAttribute(element, 'object');
            if(objectName){
                componentControl.setObject(objectName);
            }

            // array
            let arrayName = getAttribute(element, 'array');
            if(arrayName){
                componentControl.setArray(arrayName);
            }

            // returns
            return componentControl;

        }

        abstract support(element: HTMLElement): boolean;

    }

}
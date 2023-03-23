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
         * @param htmlElement
         * @param context
         */
        createComponent(htmlElement: Component, context: object): Component {

            // set context
            htmlElement.setContext(context);

            // object
            let objectName = getAttribute(htmlElement, 'object');
            if(objectName){
                htmlElement.setObject(objectName);
            }

            // array
            let arrayName = getAttribute(htmlElement, 'array');
            if(arrayName){
                htmlElement.setArray(arrayName);
            }

            // returns
            return htmlElement;

        }


        abstract support(htmlElement: HTMLElement): boolean;

    }

}
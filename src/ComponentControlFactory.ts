namespace duice {

    export class ComponentControlFactory {

        static componentControlFactoryRegistry: ComponentControlFactory[] = [];

        tagName: string;

        /**
         * register component factory
         * @param componentControlFactory
         */
        static registerComponentFactory(componentControlFactory: ComponentControlFactory): void {
            this.componentControlFactoryRegistry.push(componentControlFactory);
        }

        /**
         * return instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ComponentControlFactory {
            let instance;
            this.componentControlFactoryRegistry.forEach(componentControlFactory => {
                if (componentControlFactory.support(htmlElement)) {
                    instance = componentControlFactory;
                }
            });
            return instance;
        }

        /**
         * constructor
         * @param tagName
         */
        constructor(tagName: string) {
            this.tagName = tagName;
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

        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean {
            return (element.tagName.toLowerCase() === this.tagName);
        }

    }

}
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
         * getQuerySelectors
         */
        static getQuerySelectors(): string[] {
            let querySelectors = [];
            this.componentControlFactoryRegistry.forEach(componentControlFactory => {
                let tagName = componentControlFactory.getTagName();
                let querySelector = `${tagName}:not([${getNamespace()}\\:id])`;
                querySelectors.push(querySelector);
            });
            return querySelectors;
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
         * getTagName
         */
        getTagName(): string {
            return this.tagName;
        }

        /**
         * creates element
         * @param element
         * @param context
         */
        createComponentControl(element: Component, context: object): ComponentControl<Component> {

            // creates instance
            let componentControl = new ComponentControl(element, context);

            // data
            let dataName = getAttribute(element, 'data');
            if(dataName){
                componentControl.setData(dataName);
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
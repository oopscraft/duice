///<reference path="ComponentFactory.ts"/>
namespace duice {

    /**
     * custom component factory
     */
    export class CustomComponentFactory<T extends CustomElement> extends ComponentFactory<CustomElement> {

        static instances: CustomComponentFactory<CustomElement>[] = [];

        tagName: string;

        /**
         * adds factory instance
         * @param componentFactory
         */
        static addInstance(componentFactory: CustomComponentFactory<CustomElement>): void {
            this.instances.push(componentFactory);
        }

        /**
         * returns factory instance to be supported
         * @param element
         */
        static getInstance(element: CustomElement): CustomComponentFactory<CustomElement> {
            for(let componentFactory of this.instances){
                if(componentFactory.support(element)) {
                    return componentFactory;
                }
            }
            return null;
        }

        /**
         * constructor
         * @param tagName
         */
        constructor(tagName: string) {
            super();
            this.tagName = tagName;
        }

        /**
         * creates component
         * @param element
         * @param context
         */
        override createComponent(element: T, context: object): CustomComponent<T> {
            // creates instance
            let component = new CustomComponent(element, context);

            // set object
            let objectName = getComponentAttribute(element, 'object');
            if (objectName) {
                component.setObject(objectName);
            }

            // set array
            let arrayName = getComponentAttribute(element, 'array');
            if (arrayName) {
                component.setArray(arrayName);
            }

            // returns
            return component;
        }

        /**
         * checks supported elements
         * @param element
         */
        override support(element: T): boolean {
            return (element.tagName.toLowerCase() === this.tagName);
        }

    }

}
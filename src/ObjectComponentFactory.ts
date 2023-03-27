///<reference path="ComponentFactory.ts"/>
namespace duice {

    /**
     * object component factory class
     */
    export class ObjectComponentFactory<T extends HTMLElement> extends ComponentFactory<T> {

        static defaultInstance = new ObjectComponentFactory();

        static instances: ObjectComponentFactory<HTMLElement>[] = [];

        /**
         * adds factory instance to registry
         * @param componentFactory
         */
        static addInstance(componentFactory: ObjectComponentFactory<HTMLElement>): void {
            this.instances.push(componentFactory);
        }

        /**
         * returns supported instance
         * @param element
         */
        static getInstance(element: HTMLElement): ObjectComponentFactory<HTMLElement> {
            for(let componentFactory of this.instances){
                if(componentFactory.support(element)) {
                    return componentFactory;
                }
            }
            if(this.defaultInstance.support(element)){
                return this.defaultInstance;
            }
            return null;
        }

        /**
         * check support
         * @param element
         */
        override support(element: T): boolean {
            if(hasComponentAttribute(element, 'object')){
                if(this.doSupport(element)){
                    return true;
                }
            }
            return false;
        }

        /**
         * support template method
         * @param element
         */
        doSupport(element: T): boolean {
            return true;
        }

        /**
         * create component
         * @param element
         * @param context
         */
        override createComponent(element: T, context: object): ObjectComponent<T> {

            // creates element
            let component = this.doCreateComponent(element, context);

            // object
            let object = getComponentAttribute(element, 'object');
            component.setObject(object);

            // property
            let property = getComponentAttribute(element, 'property');
            if (property) {
                component.setProperty(property);
            }

            // format
            let format = getComponentAttribute(element, 'format');
            if (format) {
                component.setFormat(format);
            }

            // returns
            return component;
        }

        /**
         * template method to create component
         * @param htmlElement
         * @param context
         */
        doCreateComponent(htmlElement: T, context: object): ObjectComponent<T> {
            return new ObjectComponent(htmlElement, context);
        }

    }

}

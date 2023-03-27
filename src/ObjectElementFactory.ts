///<reference path="ElementFactory.ts"/>
namespace duice {

    /**
     * object element factory class
     */
    export class ObjectElementFactory<T extends HTMLElement> extends ElementFactory<T> {

        static defaultInstance = new ObjectElementFactory();

        static instances: ObjectElementFactory<HTMLElement>[] = [];

        /**
         * adds factory instance to registry
         * @param elementFactory
         */
        static addInstance(elementFactory: ObjectElementFactory<HTMLElement>): void {
            this.instances.push(elementFactory);
        }

        /**
         * returns supported instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ObjectElementFactory<HTMLElement> {
            for(let componentFactory of this.instances){
                if(componentFactory.support(htmlElement)) {
                    return componentFactory;
                }
            }
            if(this.defaultInstance.support(htmlElement)){
                return this.defaultInstance;
            }
            return null;
        }

        /**
         * check support
         * @param htmlElement
         */
        override support(htmlElement: T): boolean {
            if(hasElementAttribute(htmlElement, 'object')){
                if(this.doSupport(htmlElement)){
                    return true;
                }
            }
            return false;
        }

        /**
         * support template method
         * @param htmlElement
         */
        doSupport(htmlElement: T): boolean {
            return true;
        }

        /**
         * create component
         * @param element
         * @param context
         */
        override createElement(element: T, context: object): ObjectElement<T> {

            // creates element
            let component = this.doCreateElement(element, context);

            // object
            let object = getElementAttribute(element, 'object');
            component.setObject(object);

            // property
            let property = getElementAttribute(element, 'property');
            if (property) {
                component.setProperty(property);
            }

            // format
            let format = getElementAttribute(element, 'format');
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
        doCreateElement(htmlElement: T, context: object): ObjectElement<T> {
            return new ObjectElement(htmlElement, context);
        }

    }

}

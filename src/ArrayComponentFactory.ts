///<reference path="ComponentFactory.ts"/>
namespace duice {

    /**
     * array component factory class
     */
    export class ArrayComponentFactory<T extends HTMLElement> extends ComponentFactory<HTMLElement> {

        static defaultInstance = new ArrayComponentFactory<HTMLElement>();

        static instances: ArrayComponentFactory<HTMLElement>[] = [];

        /**
         * adds factory instance
         * @param componentFactory
         */
        static addInstance(componentFactory: ArrayComponentFactory<HTMLElement>): void {
            this.instances.push(componentFactory);
        }

        /**
         * return factory instance
         * @param element
         */
        static getInstance(element: HTMLElement): ArrayComponentFactory<HTMLElement> {
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
            if(hasComponentAttribute(element, 'array')){
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
         * creates array component
         * @param element
         * @param context
         */
        override createComponent(element: T, context: object): ArrayComponent<any> {
            let component = new ArrayComponent(element, context);

            // array
            let array = getComponentAttribute(element, 'array');
            component.setArray(array);

            // loop
            let loop = getComponentAttribute(element, 'loop');
            if(loop){
                component.setLoop(loop);
            }

            // editable
            let editable = getComponentAttribute(element, 'editable');
            if(editable){
                component.setEditable(editable.toLowerCase() === 'true');
            }

            // returns
            return component;
        }

    }

}
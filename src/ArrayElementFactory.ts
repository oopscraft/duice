///<reference path="DataElementFactory.ts"/>
namespace duice {

    /**
     * array element factory class
     */
    export class ArrayElementFactory<T extends HTMLElement> extends DataElementFactory<HTMLElement, object[]> {

        static defaultInstance = new ArrayElementFactory<HTMLElement>();

        static instances: ArrayElementFactory<HTMLElement>[] = [];

        /**
         * adds factory instance
         * @param elementFactory
         */
        static addInstance(elementFactory: ArrayElementFactory<HTMLElement>): void {
            this.instances.push(elementFactory);
        }

        /**
         * return factory instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ArrayElementFactory<HTMLElement> {
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
            if(hasElementAttribute(htmlElement, 'array')){
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
         * creates array component
         * @param htmlElement
         * @param context
         */
        override createElement(htmlElement: T, context: object): ArrayElement<any> {
            let component = new ArrayElement(htmlElement, context);

            // array
            let array = getElementAttribute(htmlElement, 'array');
            component.setArray(array);

            // loop
            let loop = getElementAttribute(htmlElement, 'loop');
            if(loop){
                component.setLoop(loop);
            }

            // hierarchy
            let hierarchy = getElementAttribute(htmlElement, 'hierarchy');
            if(hierarchy) {
                component.setHierarchy(hierarchy);
            }

            // editable
            let editable = getElementAttribute(htmlElement, 'editable');
            if(editable){
                component.setEditable(editable.toLowerCase() === 'true');
            }

            // returns
            return component;
        }

    }

}
namespace duice {

    /**
     * custom component factory registry
     */
    export class CustomElementFactoryRegistry {

        static instances: CustomElementFactory<any>[] = [];

        /**
         * adds factory instance
         * @param elementFactory
         */
        static addInstance(elementFactory: CustomElementFactory<any>): void {

            // register custom html element
            customElements.define(elementFactory.tagName, class extends HTMLElement {});

            // register instance
            this.instances.push(elementFactory);
        }

        /**
         * returns factory instance to be supported
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): CustomElementFactory<any> {
            for(let componentFactory of this.instances){
                if(componentFactory.support(htmlElement)) {
                    return componentFactory;
                }
            }
            return null;
        }

    }

}
namespace duice {

    export class DataElementRegistry {

        static objectDefaultFactory = new ObjectElementFactory();

        static arrayDefaultFactory = new ArrayElementFactory();

        static objectFactories = new Map();

        static arrayFactories = new Map();

        static customFactories = new Map();

        static register(tagName: string, dataElementFactory: DataElementFactory<HTMLElement, any>) {
            if(dataElementFactory instanceof ArrayElementFactory) {
                this.arrayFactories.set(tagName, dataElementFactory);
            }else if(dataElementFactory instanceof ObjectElementFactory) {
                this.objectFactories.set(tagName, dataElementFactory);
            }else{
                this.customFactories.set(tagName, dataElementFactory);
            }

            // register custom html element
            // customElements.define(elementFactory.tagName, class extends HTMLElement {});
        }

        /**
         * get factory
         */
        static getFactory(htmlElement: HTMLElement, data: object): DataElementFactory<HTMLElement, any> {
            let tagName = htmlElement.tagName.toLowerCase();

            if(this.customFactories.has(tagName)) {
                return this.customFactories.get(tagName);
            }

            // array element
            if(Array.isArray(data)) {
                if(this.arrayFactories.has(tagName)) {
                    return this.arrayFactories.get(tagName);
                }
                return this.arrayDefaultFactory;
            }
            // object element
            else{
                if(this.objectFactories.has(tagName)) {
                    return this.objectFactories.get(tagName);
                }
                return this.objectDefaultFactory;
            }

        }

    }
}

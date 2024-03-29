///<reference path="ObjectElementFactory.ts"/>
namespace duice {

    export class DataElementRegistry {

        static defaultObjectElementFactory = new ObjectElementFactory();

        static defaultArrayElementFactory = new ArrayElementFactory();

        static objectElementFactories = new Map<string, ObjectElementFactory<HTMLElement>>();

        static arrayElementFactories = new Map<string, ArrayElementFactory<HTMLElement>>();

        static customElementFactories = new Map<string, CustomElementFactory<any>>();

        static register(tagName: string, dataElementFactory: DataElementFactory<HTMLElement, any>) {
            if(dataElementFactory instanceof ArrayElementFactory) {
                this.arrayElementFactories.set(tagName, dataElementFactory);
            }else if(dataElementFactory instanceof ObjectElementFactory) {
                this.objectElementFactories.set(tagName, dataElementFactory);
            }else if(dataElementFactory instanceof CustomElementFactory) {
                this.customElementFactories.set(tagName, dataElementFactory);
            }

            // register custom html element
            if(tagName.includes('-')) {
                globalThis.customElements.define(tagName, class extends HTMLElement {});
            }
        }

        static getFactory(htmlElement: HTMLElement, bindData: any, context: object): DataElementFactory<HTMLElement, any> {
            let tagName = htmlElement.tagName.toLowerCase();

            // custom element
            if(this.customElementFactories.has(tagName)) {
                return this.customElementFactories.get(tagName);
            }

            // array element
            if(Array.isArray(bindData)) {
                if(this.arrayElementFactories.has(tagName)) {
                    return this.arrayElementFactories.get(tagName);
                }
                return this.defaultArrayElementFactory;
            }
            // object element
            else{
                if(this.objectElementFactories.has(tagName)) {
                    return this.objectElementFactories.get(tagName);
                }
                return this.defaultObjectElementFactory;
            }

        }

    }
}

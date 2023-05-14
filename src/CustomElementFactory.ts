///<reference path="DataElementFactory.ts"/>
namespace duice {

    /**
     * custom component factory
     */
    export class CustomElementFactory<V> extends DataElementFactory<HTMLElement, V> {

        static instances: CustomElementFactory<any>[] = [];

        tagName: string;

        elementType: Function;

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

        /**
         * constructor
         * @param tagName
         * @param elementType
         */
        constructor(tagName: string, elementType: Function) {
            super();
            this.tagName = tagName;
            this.elementType = elementType;
        }

        /**
         * creates component
         * @param htmlElement
         * @param context
         */
        override createElement(htmlElement: HTMLElement, context: object): CustomElement<any> {

            // creates instance
            let element =  Reflect.construct(this.elementType, [htmlElement, context]);

            // set object
            let objectName = getElementAttribute(htmlElement, 'object');
            if (objectName) {
                element.setObject(objectName);
            }

            // set array
            let arrayName = getElementAttribute(htmlElement, 'array');
            if (arrayName) {
                element.setArray(arrayName);
            }

            // returns
            return element;
        }

        /**
         * checks supported elements
         * @param htmlElement
         */
        override support(htmlElement: HTMLElement): boolean {
            return (htmlElement.tagName.toLowerCase() === this.tagName);
        }

    }

}
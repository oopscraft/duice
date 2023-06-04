///<reference path="DataElementFactory.ts"/>
namespace duice {

    /**
     * custom component factory
     */
    export class CustomElementFactory<V> extends DataElementFactory<HTMLElement, V> {

        tagName: string;

        elementType: Function;

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
         * @param bindData
         * @param context
         */
        override createElement(htmlElement: HTMLElement, bindData: V, context: object): DataElement<any, any> {

            // creates instance
            let element =  Reflect.construct(this.elementType, [htmlElement, bindData, context]);

            // array element
            if(element instanceof ArrayElement) {

                // loop
                let loop = getElementAttribute(htmlElement, 'loop');
                if(loop){
                    element.setLoop(loop);
                }

                // hierarchy
                let hierarchy = getElementAttribute(htmlElement, 'hierarchy');
                if(hierarchy) {
                    element.setHierarchy(hierarchy);
                }

                // editable
                let editable = getElementAttribute(htmlElement, 'editable');
                if(editable){
                    element.setEditable(editable.toLowerCase() === 'true');
                }

                // toggle class
                let toggleClass = getElementAttribute(htmlElement, 'toggle-class');
                if(toggleClass) {
                    element.setToggleClass(toggleClass);
                }

            }
            // object element
            else if(element instanceof ObjectElement) {

                // property
                let property = getElementAttribute(htmlElement, 'property');
                if (property) {
                    element.setProperty(property);
                }

                // format
                let format = getElementAttribute(htmlElement, 'format');
                if (format) {
                    element.setFormat(format);
                }

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
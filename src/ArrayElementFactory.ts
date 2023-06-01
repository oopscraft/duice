///<reference path="DataElementFactory.ts"/>
namespace duice {

    /**
     * array element factory class
     */
    export class ArrayElementFactory<T extends HTMLElement> extends DataElementFactory<HTMLElement, object[]> {

        /**
         * check support
         * @param htmlElement
         */
        override support(htmlElement: T): boolean {
            return this.doSupport(htmlElement);
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
         * @param array
         */
        override createElement(htmlElement: T, array: object[]): ArrayElement<any> {

            // create array element
            let arrayElement = new ArrayElement(htmlElement, array);

            // loop
            let loop = getElementAttribute(htmlElement, 'loop');
            if(loop){
                arrayElement.setLoop(loop);
            }

            // hierarchy
            let hierarchy = getElementAttribute(htmlElement, 'hierarchy');
            if(hierarchy) {
                arrayElement.setHierarchy(hierarchy);
            }

            // editable
            let editable = getElementAttribute(htmlElement, 'editable');
            if(editable){
                arrayElement.setEditable(editable.toLowerCase() === 'true');
            }

            // toggle class
            let toggleClass = getElementAttribute(htmlElement, 'toggle-class');
            if(toggleClass) {
                arrayElement.setToggleClass(toggleClass);
            }

            // returns
            return arrayElement;
        }

    }

}
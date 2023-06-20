///<reference path="DataElementFactory.ts"/>
namespace duice {

    /**
     * array element factory class
     */
    export class ArrayElementFactory<T extends HTMLElement> extends DataElementFactory<HTMLElement, object[]> {

        /**
         * creates array component
         * @param htmlElement
         * @param bindData
         * @param context
         */
        override createElement(htmlElement: T, bindData: object[], context: object): ArrayElement<any> {

            // create array element
            let arrayElement = new ArrayElement(htmlElement, bindData, context);

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

            // selected class
            let selectedItemClass = getElementAttribute(htmlElement, 'selected-item-class');
            if(selectedItemClass) {
                arrayElement.setSelectedItemClass(selectedItemClass);
            }

            // returns
            return arrayElement;
        }

    }

}
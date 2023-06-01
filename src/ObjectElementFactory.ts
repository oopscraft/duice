///<reference path="DataElementFactory.ts"/>
namespace duice {

    /**
     * object element factory class
     */
    export class ObjectElementFactory<T extends HTMLElement> extends DataElementFactory<T, object> {

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
         * create component
         * @param element
         * @param object
         */
        override createElement(element: T, object: object): ObjectElement<T> {

            // create object element
            let objectElement = this.doCreateElement(element, object);

            // property
            let property = getElementAttribute(element, 'property');
            if (property) {
                objectElement.setProperty(property);
            }

            // format
            let format = getElementAttribute(element, 'format');
            if (format) {
                objectElement.setFormat(format);
            }

            // returns
            return objectElement;
        }

        /**
         * template method to create component
         * @param htmlElement
         * @param object
         */
        doCreateElement(htmlElement: T, object: object): ObjectElement<T> {
            return new ObjectElement(htmlElement, object);
        }

    }

}

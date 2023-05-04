namespace duice {

    /**
     * element factory abstract class
     */
    export abstract class DataElementFactory<T extends HTMLElement> {

        /**
         * check support
         * @param element
         */
        abstract support(element: T): boolean;

        /**
         * creates element
         * @param htmlElement
         * @param context
         */
        abstract createElement(htmlElement: T, context: object): DataElement<HTMLElement>;

    }

}
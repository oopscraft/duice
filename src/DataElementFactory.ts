namespace duice {

    /**
     * element factory abstract class
     */
    export abstract class DataElementFactory<T extends HTMLElement, V> {

        /**
         * check support
         * @param element
         */
        abstract support(element: T): boolean;

        /**
         * creates element
         * @param htmlElement
         * @param bindData
         * @param context
         */
        abstract createElement(htmlElement: T, bindData: V, context: object): DataElement<HTMLElement, V>;

    }

}
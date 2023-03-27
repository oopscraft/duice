namespace duice {

    /**
     * element factory abstract class
     */
    export abstract class ElementFactory<T extends HTMLElement> {

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
        abstract createElement(htmlElement: T, context: object): Element<HTMLElement>;

    }

}
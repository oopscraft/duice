namespace duice {

    /**
     * component factory abstract class
     */
    export abstract class ComponentFactory<T extends HTMLElement> {

        /**
         * check support
         * @param element
         */
        abstract support(element: T): boolean;

        /**
         * creates component
         * @param element
         * @param context
         */
        abstract createComponent(element: T, context: object): Component<HTMLElement>;

    }

}
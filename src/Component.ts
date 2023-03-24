namespace duice {

    /**
     * Component
     */
    export abstract class Component extends HTMLElement {

        /**
         * constructor
         * @protected
         */
        protected constructor() {
            super();
        }

        /**
         * returns html template literal
         * @param data
         */
        abstract doRender(data: any): string;

        /**
         * return style literal
         * @param data
         */
        doStyle(data: any): string {
            return null;
        }
    }

}
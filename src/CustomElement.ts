namespace duice {

    /**
     * custom element
     */
    export abstract class CustomElement extends HTMLElement {

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
        abstract doRender(data: Data): string;

        /**
         * return style literal
         * @param data
         */
        doStyle(data: any): string {
            return null;
        }
    }

}
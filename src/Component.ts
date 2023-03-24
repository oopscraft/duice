namespace duice {

    /**
     * Component
     */
    export abstract class Component extends HTMLElement {


        /**
         * constructor
         * @param htmlElement
         * @param context
         * @protected
         */
        protected constructor() {
            super();
        }

        /**
         * returns html template literal
         * @param data
         */
        abstract doRender(data: DataProxy): string;

        /**
         * return style literal
         * @param data
         */
        doStyle(data: DataProxy): string {
            return null;
        }
    }


}
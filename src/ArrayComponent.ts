///<reference path="Component.ts"/>
namespace duice {

    /**
     * ArrayComponent
     */
    export abstract class ArrayComponent extends Component<object[]> {

        var: string;

        status: string;

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement) {
            console.debug("ArrayComponent.constructor", element);
            super(element);
            this.var = this.getAttribute("var");
            this.status = this.getAttribute("status");
        }

        /**
         * getVar
         */
        getVar(): string {
            return this.var;
        }

        /**
         * getStatus
         */
        getStatus(): string {
            return this.status;
        }

        /**
         * createRow
         * @param object
         */
        abstract createRowElement(object: object, status: object): HTMLElement;

    }

}
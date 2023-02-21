///<reference path="Component.ts"/>
namespace duice {

    /**
     * ArrayComponent
     */
    export abstract class ArrayComponent extends Component {

        item: string;

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
            this.item = this.getAttribute("item");
            this.status = this.getAttribute("status");
        }

        /**
         * getItem
         */
        getItem(): string {
            return this.item;
        }

        /**
         * getStatus
         */
        getStatus(): string {
            return this.status;
        }

    }

}
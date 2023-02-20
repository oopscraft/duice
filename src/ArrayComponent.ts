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
         * update
         * @param arrayHandler
         */
        update(arrayHandler: ArrayHandler, event: object) {
            console.debug("ArrayComponent.update", arrayHandler, event);
            let array = arrayHandler.getTarget();
            this.setArray(array);
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

        /**
         * setArray
         * @param array
         */
        abstract setArray(array:object[]);

    }

}
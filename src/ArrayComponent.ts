///<reference path="Component.ts"/>
namespace duice {

    /**
     * ArrayComponent
     */
    export abstract class ArrayComponent extends Component<Array> {

        item: string;

        status: string;

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement, context: object) {
            console.debug("ArrayComponent.constructor", element);
            super(element, context);
            this.item = this.getAttribute("item");
            this.status = this.getAttribute("status");

            // bind
            let array = findObject(context, this.getAttribute("bind"));
            this.bind(array._handler_);

            // update
            this.update(array._handler_);
        }

        /**
         * update
         * @param arrayHandler
         */
        update(arrayHandler: ArrayHandler) {
            console.debug("ArrayComponent.update", arrayHandler);
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
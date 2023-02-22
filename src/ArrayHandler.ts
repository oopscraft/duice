///<reference path="Handler.ts"/>
namespace duice {

    /**
     * Set data structure
     */
    export class ArrayHandler extends Handler {

        /**
         * constructor
         * @param target
         */
        constructor(array: Array) {
            super(array);
        }

        /**
         * doUpdate
         * @param arrayComponent
         * @param arrayEvent
         */
        doUpdate(arrayComponent: ArrayComponent, arrayEvent: ArrayEvent): void {
            console.debug("ArrayHandler.doUpdate", arrayComponent, arrayEvent);
        }

    }
}
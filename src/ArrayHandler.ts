///<reference path="Handler.ts"/>
namespace duice {

    /**
     * ArrayHandler
     */
    export class ArrayHandler extends Handler<object[]> {

        /**
         * constructor
         * @param target
         */
        constructor(array: object[]) {
            super(array);
        }

        /**
         * array
         * @param target
         * @param thisArg
         * @param argumentsList
         */
        apply(target, thisArg, argumentsList) {
            Reflect.apply(target, thisArg, argumentsList);
        }

        /**
         * update
         * @param component
         * @param detail
         */
        update(component: ArrayComponent, detail: object): void {
            console.debug("ArrayHandler.update:", component, detail);
        }

    }
}
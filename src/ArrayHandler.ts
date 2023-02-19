///<reference path="Handler.ts"/>
namespace duice {

    /**
     * Set data structure
     */
    export class ArrayHandler extends Handler<Array> {

        /**
         * constructor
         * @param target
         */
        constructor(array: Array) {
            super(array);
        }

        /**
         * update
         * @param arrayComponent
         */
        update(arrayComponent: ArrayComponent): void {
            console.log("Set.update", arrayComponent);
        }

        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: Object, property: string, value: any): boolean {
            console.log("ArrayHandler.change", target, property, value);
            this.notifyObservers();
            return true;
        }
    }
}
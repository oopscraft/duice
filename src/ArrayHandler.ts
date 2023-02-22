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

        // /**
        //  * set
        //  * @param target
        //  * @param property
        //  * @param value
        //  */
        // set(target: Object, property: string, value: any): boolean {
        //     console.log("ArrayHandler.change", target, property, value);
        //     this.notifyObservers(new Event(this, {}));
        //     return true;
        // }
        //
        // update(component: duice.Component, event: duice.MapEvent): void {
        // }
    }
}
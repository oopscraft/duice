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
        constructor(target: Array) {
            super(target);
        }

        /**
         * update
         * @param observable
         */
        update(observable: ArrayComponent): void {
            console.log("Set.update", observable);
        }

        set(target: Object, property: string, value: any): boolean {
            console.log("ArrayHandler.change", target, property, value);
            //this.notifyObservers();
            return true;
        }
    }
}
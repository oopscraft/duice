///<reference path="ArrayHandler.ts"/>
namespace duice {

    /**
     * ArrayProxy
     */
    export class Array {

        /**
         * constructor
         * @param array
         */
        constructor(array: object[]) {
            return new Proxy(array, new ArrayHandler(array));
        }

    }

}
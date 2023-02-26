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
            // for(let i = 0, size = array.length; i < size; i ++){
            //     array[i] = new duice.Object(array[i]);
            // }
            return new Proxy(array, new ArrayHandler(array));
        }

    }

}
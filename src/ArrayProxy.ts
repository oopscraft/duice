namespace duice {

    /**
     * ArrayProxy
     */
    export class ArrayProxy {

        /**
         * constructor
         * @param target
         */
        constructor(target: object[]) {
            let targetCopy = new Array();
            target.forEach(element => {
               targetCopy.push(new ObjectProxy(element));
            });
            return new Proxy(targetCopy, new ArrayHandler(target));
        }

    }

}
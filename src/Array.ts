namespace duice {

    /**
     * ArrayProxy
     */
    export class Array extends globalThis.Array {

        /**
         * constructor
         * @param target
         */
        constructor(target: object[]) {
            super();
            target.forEach(element => {
               this.push(new duice.Object(element));
            });
            return new Proxy(this, new ArrayHandler(this));
        }

    }

}
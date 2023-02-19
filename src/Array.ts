///<reference path="ArrayHandler.ts"/>
namespace duice {

    /**
     * ArrayProxy
     */
    export class Array extends globalThis.Array {

        /**
         * constructor
         * @param json
         */
        constructor(json: object[]) {
            super();
            json.forEach(element => {
               this.push(new duice.Object(element));
            });
            return new Proxy(this, new ArrayHandler(this));
        }

    }

}
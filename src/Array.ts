///<reference path="ArrayHandler.ts"/>
namespace duice {


    /**
     * ArrayProxy
     */
    export class Array extends globalThis.Array {

        /**
         * constructor
         * @param array
         */
        constructor(json: object[]) {
            super();
            this.fromJson(json);
        }

        /**
         * fromJson
         * @param json
         */
        fromJson(json: object[]): void {
            for(let i = 0, size = json.length; i < size; i ++){
                let object = new duice.Object(json[i]);
                this.push(new Proxy(object, new ObjectHandler(object)));
            }
        }

    }

}
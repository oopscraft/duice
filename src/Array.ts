namespace duice {


    /**
     * ArrayProxy
     */
    export class Array extends globalThis.Array {

        /**
         * create
         * @param json
         */
        static create(target: object[]): any {
            let array = new Array(target);
            let arrayHandler = new ArrayHandler(target);
            return new Proxy(array, arrayHandler);
        }

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
                let object = duice.Object.create(json[i]);
                this.push(new Proxy(object, new ObjectHandler(object)));
            }
        }

    }

}
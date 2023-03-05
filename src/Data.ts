namespace duice {

    /**
     * Data
     */
    export class Data extends globalThis.Object {

        /**
         * create
         * @param object
         */
        static create(object: object): any {
            let data = new Data(object);
            let dataHandler = new DataHandler(data);
            globalThis.Object.defineProperty(data, "_handler_", {
                value: dataHandler,
                writable: true
            });
            return new Proxy(data, dataHandler);
        }

        /**
         * constructor
         * @param object
         */
        private constructor(object: object) {
            super();
            for(let property in object){
                let value = object[property];
                this[property] = value;
            }
        }

    }
}
namespace duice {


    /**
     * DataSet
     */
    export class DataSet extends globalThis.Array {

        /**
         * create
         * @param json
         */
        static create(array: object[]): any {
            let dataSet = new DataSet(array);
            let dataSetHandler = new DataSetHandler(dataSet);
            globalThis.Object.defineProperty(dataSet, "_handler_", {
                value: dataSetHandler,
                writable: true
            });
            return new Proxy(dataSet, dataSetHandler);
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
         * @param array
         */
        fromJson(array: object[]): void {
            for(let i = 0, size = array.length; i < size; i ++){
                let object = duice.Data.create(array[i]);
                this.push(new Proxy(object, new DataHandler(object)));
            }
        }

    }

}
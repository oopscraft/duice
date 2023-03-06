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
        constructor(array: object[]) {
            super();
            this.copy(array);
        }

        /**
         * copy
         * @param array
         */
        copy(array: object[]): void {
            this.length = 0;
            for(let i = 0, size = array.length; i < size; i ++){
                let data = duice.Data.create(array[i]);
                this.push(data);
            }
        }

        /**
         * fromJson
         * @param array
         */
        fromJson(array: object[]): void {
            this.copy(array);
            let handler = Object.getOwnPropertyDescriptor(this, '_handler_').value;
            handler.notifyObservers({});
        }

        /**
         * toJson
         */
        toJson(): string {
            return JSON.stringify(this);
        }
    }

}
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
            DataSet.internalAssign(this, array);
        }

        /**
         * internalAssign
         * @param dataSet
         * @param array
         */
        static internalAssign(dataSet: DataSet, array: object[]): DataSet {
            dataSet.length = 0;
            for(let i = 0, size = array.length; i < size; i ++){
                dataSet[i] = duice.Data.create(array[i]);
            }
            return dataSet;
        }

        /**
         * assign
         * @param dataSet
         * @param array
         */
        static assign(dataSet: DataSet, array: object[]): DataSet {
            DataSet.internalAssign(dataSet, array);
            DataSet.notify(dataSet);
            return dataSet;
        }

        /**
         * notify
         * @param dataSet
         */
        static notify(dataSet: DataSet): void {
            let handler = Object.getOwnPropertyDescriptor(dataSet, '_handler_').value;
            handler.notifyObservers({});
        }

    }

}
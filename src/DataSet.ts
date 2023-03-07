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

            // _handler_
            Object.defineProperty(dataSet, '_handler_', {
                value: dataSetHandler,
                writable: true
            });

            // _meta_
            let dataSetMeta = new DataSetMeta();
            Object.defineProperty(dataSet, '_meta_', {
                value: dataSetMeta,
                writable: true
            });

            // return this as proxy instance
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
         * getHandler
         * @param dataSet
         */
        static getHandler(dataSet: DataSet): DataSetHandler {
            return Object.getOwnPropertyDescriptor(dataSet, '_handler_').value as DataSetHandler;
        }

        /**
         * getMeta
         * @param data
         */
        static getMeta(data: Data): DataSetMeta {
            return Object.getOwnPropertyDescriptor(data, '_meta_').value as DataSetMeta;
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
            let handler = this.getHandler(dataSet);
            handler.notifyObservers({});
        }

        /**
         * setReadonly
         * @param dataSet
         * @param property
         * @param readonly
         */
        static setReadonly(dataSet: DataSet, property: string, readonly: boolean): void {
            let meta = this.getMeta(dataSet);
            meta.setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param dataSet
         * @param property
         */
        static isReadonly(dataSet: DataSet, property: string): boolean {
            let meta = this.getMeta(dataSet);
            return meta.isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param dataSet
         * @param readonly
         */
        static setReadonlyAll(dataSet: DataSet, readonly: boolean): void {
            let meta = this.getMeta(dataSet);
            meta.setReadonlyAll(readonly);
            for(let index = 0; index >= dataSet.length; index ++ ){
                DataSet.setReadonlyAll(dataSet[index], readonly);
            }
        }

    }

}
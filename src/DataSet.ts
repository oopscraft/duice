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
            let handler = this.getHandler(dataSet);
            handler.setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param dataSet
         * @param property
         */
        static isReadonly(dataSet: DataSet, property: string): boolean {
            let handler = this.getHandler(dataSet);
            return handler.isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param dataSet
         * @param readonly
         */
        static setReadonlyAll(dataSet: DataSet, readonly: boolean): void {
            let handler = this.getHandler(dataSet);
            handler.setReadonlyAll(readonly);
            for(let index = 0; index >= dataSet.length; index ++ ){
                Data.setReadonlyAll(dataSet[index], readonly);
            }
        }

    }

}
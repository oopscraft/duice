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
            let dataSet = new DataSet();
            let dataSetHandler = new DataSetHandler(dataSet);
            dataSetHandler.assign(array);
            return new Proxy(dataSet, dataSetHandler);
        }

        /**
         * constructor
         * @protected
         */
        protected constructor() {
            super();
        }

        /**
         * getHandler
         * @param dataSet
         */
        static getHandler(dataSet: DataSet): DataSetHandler {
            return Object.getOwnPropertyDescriptor(dataSet, '_handler_').value as DataSetHandler;
        }

        /**
         * assign
         * @param dataSet
         * @param array
         */
        static assign(dataSet: DataSet, array: object[]): DataSet {
            let handler = this.getHandler(dataSet);
            handler.assign(array);
            handler.notifyObservers({});
            return dataSet;
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
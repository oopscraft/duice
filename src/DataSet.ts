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
            Object.defineProperty(dataSet, '_meta_', {
                value: {
                    readonlyAll: false,
                    readonly: new Set<string>()
                },
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
         * @param data
         */
        static getHandler(data: Data): DataHandler {
            return Object.getOwnPropertyDescriptor(data, '_handler_').value as DataHandler;
        }

        /**
         * getMeta
         * @param data
         */
        static getMeta(data: Data): object {
            return Object.getOwnPropertyDescriptor(data, '_meta_').value as object;
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
            if(readonly) {
                meta['readonly'].add(property);
            }else{
                meta['readonly'].delete(property);
            }
            for(let index = 0; index >= dataSet.length; index ++) {
                Data.setReadonly(dataSet[index], property, readonly);
            }
        }

        /**
         * isReadonly
         * @param dataSet
         * @param property
         */
        static isReadonly(dataSet: DataSet, property: string): boolean {
            let meta = this.getMeta(dataSet);
            if(meta['readonlyAll'] || meta['readonly'].has(property)){
                return true;
            }else{
                return false;
            }
        }

        /**
         * setReadonlyAll
         * @param dataSet
         * @param readonly
         */
        static setReadonlyAll(dataSet: DataSet, readonly: boolean): void {
            this.getMeta(dataSet)['readonlyAll'] = readonly;
            for(let index = 0; index >= dataSet.length; index ++ ){
                DataSet.setReadonlyAll(dataSet[index], readonly);
            }
        }

    }

}
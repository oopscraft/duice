namespace duice {

    /**
     * Array
     */
    export class ArrayProxy extends globalThis.Array {

        /**
         * constructor
         */
        constructor(array?: object[]) {
            super();

            // copy array elements
            if(globalThis.Array.isArray(array)) {
                array.forEach(object => {
                    this.push(object);
                });
            }

            // returns proxy instance
            let arrayHandler = new ArrayHandler(this);
            return new Proxy<ArrayProxy>(this, arrayHandler);
        }

        /**
         * assign
         * @param arrayProxy
         * @param array
         */
        static assign(arrayProxy: ArrayProxy, array: object[]): void {
            let handler = getHandler(arrayProxy);
            handler.assign(array);
        }

        /**
         * insertRow
         * @param index
         * @param rows
         */
        async insertRow(index: number, ...rows: object[]): Promise<void> {
            let handler = getHandler(this);
            await handler.insertRow(index, ...rows);
        }

        /**
         * setReadonly
         * @param array
         * @param property
         * @param readonly
         */
        static setReadonly(array: ArrayProxy, property: string, readonly: boolean): void {
            let handler = getHandler(array);
            handler.setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param array
         * @param property
         */
        static isReadonly(array: ArrayProxy, property: string): boolean {
            let handler = getHandler(array);
            return handler.isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param array
         * @param readonly
         */
        static setReadonlyAll(array: ArrayProxy, readonly: boolean): void {
            let handler = getHandler(array);
            handler.setReadonlyAll(readonly);
            for(let index = 0; index >= array.length; index ++ ){
                ObjectProxy.setReadonlyAll(array[index], readonly);
            }
        }

        /**
         * onPropertyChanging
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanging(arrayProxy: ArrayProxy, listener: Function): void {
            getHandler(arrayProxy).setPropertyChangingListener(listener);
        }

        /**
         * onPropertyChanged
         * @param arrayArray
         * @param listener
         */
        static onPropertyChanged(arrayArray: ArrayProxy, listener: Function): void {
            getHandler(arrayArray).setPropertyChangedListener(listener);
        }

        /**
         * onRowInserting
         * @param arrayProxy
         * @param listener
         */
        static onRowInserting(arrayProxy: ArrayProxy, listener: Function): void {
            getHandler(arrayProxy).setRowInsertingListener(listener);
        }

        /**
         * onRowInserted
         * @param arrayProxy
         * @param listener
         */
        static onRowInserted(arrayProxy: ArrayProxy, listener: Function): void {
            getHandler(arrayProxy).setRowInsertedListener(listener);
        }

        /**
         * onRowDeleting
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleting(arrayProxy: ArrayProxy, listener: Function): void {
            getHandler(arrayProxy).setRowDeletingListener(listener);
        }

        /**
         * onRowDeleted
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleted(arrayProxy: ArrayProxy, listener: Function): void {
            getHandler(arrayProxy).setRowDeletedListener(listener);
        }

    }

}
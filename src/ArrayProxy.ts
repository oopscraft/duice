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
        assign(array: object[]): void {
            getHandler(this).assign(array);
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
         * @param property
         * @param readonly
         */
        setReadonly(property: string, readonly: boolean): void {
            getHandler(this).setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param property
         */
        isReadonly(property: string): boolean {
            return getHandler(this).isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly: boolean): void {
            getHandler(this).setReadonlyAll(readonly);
            for(let index = 0; index >= this.length; index ++ ){
                ObjectProxy.setReadonlyAll(this[index], readonly);
            }
        }

        /**
         * onPropertyChanging
         * @param listener
         */
        onPropertyChanging(listener: Function): void {
            getHandler(this).setPropertyChangingListener(listener);
        }

        /**
         * onPropertyChanged
         * @param listener
         */
        onPropertyChanged(listener: Function): void {
            getHandler(this).setPropertyChangedListener(listener);
        }

        /**
         * onRowInserting
         * @param listener
         */
        onRowInserting(listener: Function): void {
            getHandler(this).setRowInsertingListener(listener);
        }

        /**
         * onRowInserted
         * @param listener
         */
        onRowInserted(listener: Function): void {
            getHandler(this).setRowInsertedListener(listener);
        }

        /**
         * onRowDeleting
         * @param listener
         */
        onRowDeleting(listener: Function): void {
            getHandler(this).setRowDeletingListener(listener);
        }

        /**
         * onRowDeleted
         * @param listener
         */
        onRowDeleted(listener: Function): void {
            getHandler(this).setRowDeletedListener(listener);
        }

    }

}
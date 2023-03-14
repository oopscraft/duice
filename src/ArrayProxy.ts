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

            // creates handler
            let handler = new ArrayHandler(this);

            // copy array elements
            if (globalThis.Array.isArray(array)) {
                array.forEach(object => {
                    let objectProxy = new ObjectProxy(object);
                    this.push(objectProxy);
                    ObjectProxy.getHandler(objectProxy).addObserver(handler);
                });
            }

            // returns proxy instance
            return new Proxy<ArrayProxy>(this, handler);
        }

        /**
         * getHandler
         */
        getHandler(): ArrayHandler {
            return Handler.getHandler<ArrayProxy,ArrayHandler>(this);
        }

        /**
         * assign
         * @param arrayProxy
         * @param array
         */
        assign(array: object[]): void {
            this.getHandler().assign(array);
        }

        /**
         * insertRow
         * @param index
         * @param rows
         */
        async insertRow(index: number, ...rows: object[]): Promise<void> {
            await this.getHandler().insertRow(index, ...rows);
        }

        async deleteRow(index: number, size?: number): Promise<void> {
            await this.getHandler().deleteRow(index, size);
        }

        /**
         * appendRows
         * @param rows
         */
        async appendRow(...rows: object[]): Promise<void> {
            await this.getHandler().appendRow(...rows);
        }

        /**
         * setReadonly
         * @param property
         * @param readonly
         */
        setReadonly(property: string, readonly: boolean): void {
            this.getHandler().setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param property
         */
        isReadonly(property: string): boolean {
            return this.getHandler().isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly: boolean): void {
            this.getHandler().setReadonlyAll(readonly);
            for(let index = 0; index >= this.length; index ++ ){
                ObjectProxy.setReadonlyAll(this[index], readonly);
            }
        }

        /**
         * onPropertyChanging
         * @param listener
         */
        onPropertyChanging(listener: Function): void {
            this.getHandler().setPropertyChangingListener(listener);
        }

        /**
         * onPropertyChanged
         * @param listener
         */
        onPropertyChanged(listener: Function): void {
            this.getHandler().setPropertyChangedListener(listener);
        }

        /**
         * onRowInserting
         * @param listener
         */
        onRowInserting(listener: Function): void {
            this.getHandler().setRowInsertingListener(listener);
        }

        /**
         * onRowInserted
         * @param listener
         */
        onRowInserted(listener: Function): void {
            this.getHandler().setRowInsertedListener(listener);
        }

        /**
         * onRowDeleting
         * @param listener
         */
        onRowDeleting(listener: Function): void {
            this.getHandler().setRowDeletingListener(listener);
        }

        /**
         * onRowDeleted
         * @param listener
         */
        onRowDeleted(listener: Function): void {
            this.getHandler().setRowDeletedListener(listener);
        }

    }

}
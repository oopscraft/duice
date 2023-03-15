namespace duice {

    /**
     * Array
     */
    export class ArrayProxy extends globalThis.Array {

        /**
         * constructor
         */
        constructor(array: object[]) {
            super();

            // array handler
            let arrayHandler = new ArrayHandler();

            // copy array elements
            array.forEach((object, index) => {
                let objectProxy = new ObjectProxy(object);
                ObjectProxy.getHandler(objectProxy).addObserver(arrayHandler);
                this[index] = objectProxy;
            });

            // create proxy
            let arrayProxy = new Proxy<ArrayProxy>(this, arrayHandler);
            arrayHandler.setTarget(arrayProxy);

            // set handler
            ArrayProxy.setHandler(arrayProxy, arrayHandler);

            // returns
            return arrayProxy;
        }

        /**
         * assign
         * @param arrayProxy
         * @param array
         */
        static assign(arrayProxy: ArrayProxy, array: object[]): void {
            console.log('ArrayProxy.assign', arrayProxy, array);
            let arrayHandler = this.getHandler(arrayProxy);
            try {

                // suspend
                arrayHandler.suspendListener()
                arrayHandler.suspendNotify();

                // clears elements
                arrayProxy.length = 0;

                // creates elements
                array.forEach((object, index) => {
                    let objectProxy = new ObjectProxy(object);
                    ObjectProxy.getHandler(objectProxy).addObserver(arrayHandler);
                    arrayProxy[index] = objectProxy;
                    console.log('== push', objectProxy);

                    // add listener
                    ObjectProxy.onPropertyChanging(objectProxy, arrayHandler.propertyChangingListener);
                    ObjectProxy.onPropertyChanged(objectProxy, arrayHandler.propertyChangedListener);
                });

            } finally {
                // resume
                arrayHandler.resumeListener();
                arrayHandler.resumeNotify();
            }

            // notify observers
            arrayHandler.notifyObservers(new Event(this));
        }

        /**
         * setHandler
         * @param arrayProxy
         * @param arrayHandler
         */
        static setHandler(arrayProxy: ArrayProxy, arrayHandler: ArrayHandler): void {
            globalThis.Object.defineProperty(arrayProxy, '_handler_', {
                value: arrayHandler,
                writable: true
            });
        }

        /**
         * getHandler
         * @param arrayProxy
         */
        static getHandler(arrayProxy: ArrayProxy): ArrayHandler {
            let handler = globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_handler_').value;
            assert(handler, 'handler is not found');
            return handler;
        }

        /**
         * onPropertyChanging
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanging(arrayProxy: ArrayProxy, listener: Function): void {
            this.getHandler(arrayProxy).propertyChangingListener = listener;
        }

        /**
         * onPropertyChanged
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanged(arrayProxy: ArrayProxy, listener: Function): void {
            this.getHandler(arrayProxy).propertyChangedListener = listener;
        }












        // /**
        //  * getHandler
        //  */
        // static getHandler(arrayProxy: ArrayProxy): ArrayHandler {
        //     return Handler.getHandler<ArrayProxy,ArrayHandler>(arrayProxy);
        // }
        //
        // /**
        //  * assign
        //  * @param arrayProxy
        //  * @param array
        //  */
        // assign(array: object[]): void {
        //     this.getHandler().assign(array);
        // }
        //
        // /**
        //  * insertRow
        //  * @param index
        //  * @param rows
        //  */
        // async insertRow(index: number, ...rows: object[]): Promise<void> {
        //     await this.getHandler().insertRow(index, ...rows);
        // }
        //
        // async deleteRow(index: number, size?: number): Promise<void> {
        //     await this.getHandler().deleteRow(index, size);
        // }
        //
        // /**
        //  * appendRows
        //  * @param rows
        //  */
        // async appendRow(...rows: object[]): Promise<void> {
        //     await this.getHandler().appendRow(...rows);
        // }
        //
        // /**
        //  * setReadonly
        //  * @param property
        //  * @param readonly
        //  */
        // setReadonly(property: string, readonly: boolean): void {
        //     // this.getHandler().setReadonly(property, readonly);
        // }
        //
        // /**
        //  * isReadonly
        //  * @param property
        //  */
        // isReadonly(property: string): boolean {
        //     // return this.getHandler().isReadonly(property);
        //     return false;
        // }
        //
        // /**
        //  * setReadonlyAll
        //  * @param readonly
        //  */
        // setReadonlyAll(readonly: boolean): void {
        //     // this.getHandler().setReadonlyAll(readonly);
        //     // for(let index = 0; index >= this.length; index ++ ){
        //     //     ObjectProxy.setReadonlyAll(this[index], readonly);
        //     // }
        // }
        //
        // /**
        //  * onPropertyChanging
        //  * @param listener
        //  */
        // onPropertyChanging(listener: Function): void {
        //     // this.getHandler().setPropertyChangingListener(listener);
        // }
        //
        // /**
        //  * onPropertyChanged
        //  * @param listener
        //  */
        // onPropertyChanged(listener: Function): void {
        //     // this.getHandler().setPropertyChangedListener(listener);
        // }
        //
        // /**
        //  * onRowInserting
        //  * @param listener
        //  */
        // onRowInserting(listener: Function): void {
        //     // this.getHandler().setRowInsertingListener(listener);
        // }
        //
        // /**
        //  * onRowInserted
        //  * @param listener
        //  */
        // onRowInserted(listener: Function): void {
        //     // this.getHandler().setRowInsertedListener(listener);
        // }
        //
        // /**
        //  * onRowDeleting
        //  * @param listener
        //  */
        // onRowDeleting(listener: Function): void {
        //     // this.getHandler().setRowDeletingListener(listener);
        // }
        //
        // /**
        //  * onRowDeleted
        //  * @param listener
        //  */
        // onRowDeleted(listener: Function): void {
        //     // this.getHandler().setRowDeletedListener(listener);
        // }

    }

}
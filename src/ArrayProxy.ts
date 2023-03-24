namespace duice {

    /**
     * ArrayProxy
     */
    export class ArrayProxy extends globalThis.Array {

        /**
         * constructor
         */
        constructor(array?: object[]) {
            super();

            // array handler
            let arrayHandler = new ArrayProxyHandler();

            // copy array elements
            if(globalThis.Array.isArray(array)){
                array.forEach((object, index) => {
                    let objectProxy = new ObjectProxy(object);
                    ObjectProxy.getHandler(objectProxy).addObserver(arrayHandler);
                    this[index] = objectProxy;
                });
            }

            // create proxy
            let arrayProxy = new Proxy<ArrayProxy>(this, arrayHandler);
            arrayHandler.setTarget(arrayProxy);

            // set property
            ArrayProxy.setHandler(arrayProxy, arrayHandler);
            ArrayProxy.setTarget(arrayProxy, this);

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
         * setTarget
         * @param arrayProxy
         * @param target
         */
        static setTarget(arrayProxy: ArrayProxy, target: object): void {
            globalThis.Object.defineProperty(arrayProxy, '_target_', {
                value: target,
                writable: true
            });
        }

        /**
         * getTarget
         * @param arrayProxy
         */
        static getTarget(arrayProxy: ArrayProxy): any {
            return globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_target_').value;
        }

        /**
         * setHandler
         * @param arrayProxy
         * @param arrayHandler
         */
        static setHandler(arrayProxy: ArrayProxy, arrayHandler: ArrayProxyHandler): void {
            globalThis.Object.defineProperty(arrayProxy, '_handler_', {
                value: arrayHandler,
                writable: true
            });
        }

        /**
         * getHandler
         * @param arrayProxy
         */
        static getHandler(arrayProxy: ArrayProxy): ArrayProxyHandler {
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
            arrayProxy.forEach(objectProxy => {
                ObjectProxy.getHandler(objectProxy).propertyChangingListener = listener;
            });
        }

        /**
         * onPropertyChanged
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanged(arrayProxy: ArrayProxy, listener: Function): void {
            this.getHandler(arrayProxy).propertyChangedListener = listener;
            arrayProxy.forEach(objectProxy => {
                ObjectProxy.getHandler(objectProxy).propertyChangedListener = listener;
            });
        }

        /**
         * onRowInserting
         * @param arrayProxy
         * @param listener
         */
        static onRowInserting(arrayProxy: ArrayProxy, listener: Function): void {
            this.getHandler(arrayProxy).rowInsertingListener = listener;
        }

        /**
         * onRowInserted
         * @param arrayProxy
         * @param listener
         */
        static onRowInserted(arrayProxy: ArrayProxy, listener: Function): void {
            this.getHandler(arrayProxy).rowInsertedListener = listener;
        }

        /**
         * onRowDeleting
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleting(arrayProxy: ArrayProxy, listener: Function): void {
            this.getHandler(arrayProxy).rowDeletingListener = listener;
        }

        /**
         * onRowDeleted
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleted(arrayProxy: ArrayProxy, listener: Function): void {
            this.getHandler(arrayProxy).rowDeletedListener = listener;
        }

        /**
         * setReadonly
         * @param arrayProxy
         * @param property
         * @param readonly
         */
        static setReadonly(arrayProxy: ArrayProxy, property: string, readonly: boolean): void {
            this.getHandler(arrayProxy).setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param arrayProxy
         * @param property
         */
        static isReadonly(arrayProxy: ArrayProxy, property: string): boolean {
             return this.getHandler(arrayProxy).isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param arrayProxy
         * @param readonly
         */
        static setReadonlyAll(arrayProxy: ArrayProxy, readonly: boolean): void {
            this.getHandler(arrayProxy).setReadonlyAll(readonly);
            for(let index = 0; index >= this.length; index ++ ){
                 ObjectProxy.setReadonlyAll(this[index], readonly);
            }
        }

        /**
         * insertRow
         * @param index
         * @param rows
         */
        async insertRow(index: number, ...rows: object[]): Promise<void> {
            let arrayHandler = ArrayProxy.getHandler(this);
            let proxyTarget = ArrayProxy.getTarget(this);
            rows.forEach((object, index) => {
                rows[index] = new ObjectProxy(object);
            });
            let event = new RowInsertEvent(this, index, rows);
            if (await arrayHandler.checkListener(arrayHandler.rowInsertingListener, event)) {
                proxyTarget.splice(index, 0, ...rows);
                await arrayHandler.checkListener(arrayHandler.rowInsertedListener, event);
                arrayHandler.notifyObservers(event);
            }
        }

        /**
         * deleteRow
         * @param index
         * @param size
         */
        async deleteRow(index: number, size?: number): Promise<void> {
            let arrayHandler = ArrayProxy.getHandler(this);
            let proxyTarget = ArrayProxy.getTarget(this);
            let sliceBegin = index;
            let sliceEnd = (size ? index + size : index + 1);
            let rows = proxyTarget.slice(sliceBegin, sliceEnd);
            let event = new RowDeleteEvent(this, index, rows);
            if (await arrayHandler.checkListener(arrayHandler.rowDeletingListener, event)) {
                let spliceStart = index;
                let spliceDeleteCount = (size ? size : 1);
                proxyTarget.splice(spliceStart, spliceDeleteCount);
                await arrayHandler.checkListener(arrayHandler.rowDeletedListener, event);
                arrayHandler.notifyObservers(event);
            }
        }

        /**
         * appendRow
         * @param rows
         */
        async appendRow(...rows: object[]): Promise<void> {
            let index = this.length;
            return this.insertRow(index, ...rows);
        }

    }

}
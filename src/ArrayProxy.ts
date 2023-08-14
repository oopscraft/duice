namespace duice {

    export class ArrayProxy extends globalThis.Array {

        constructor(array: object[]) {
            super();

            // array handler
            let arrayHandler = new ArrayHandler();

            // copy array elements
            if(globalThis.Array.isArray(array)){
                for(let i = 0; i < array.length; i++ ){
                    let objectProxy = new ObjectProxy(array[i]);
                    ObjectProxy.getHandler(objectProxy).addObserver(arrayHandler);
                    array[i] = objectProxy;
                }
            }

            // create proxy
            let arrayProxy = new Proxy<object[]>(array, arrayHandler);
            arrayHandler.setTarget(array);

            // set property
            ArrayProxy.setHandler(arrayProxy, arrayHandler);
            ArrayProxy.setTarget(arrayProxy, array);

            // returns
            return arrayProxy;
        }

        static clear(arrayProxy: object[]): void {
            let arrayHandler = this.getHandler(arrayProxy);
            try {
                // suspend
                arrayHandler.suspendListener();
                arrayHandler.suspendNotify();

                // clear element
                arrayProxy.length = 0;

            } finally {
                // resume
                arrayHandler.resumeListener();
                arrayHandler.resumeNotify();
            }

            // notify observers
            arrayHandler.notifyObservers(new event.Event(this));
        }

        static assign(arrayProxy: object[], array: object[]): void {
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
            arrayHandler.notifyObservers(new event.Event(this));
        }

        static setTarget(arrayProxy: object[], target: object[]): void {
            globalThis.Object.defineProperty(arrayProxy, '_target_', {
                value: target,
                writable: true
            });
        }

        static getTarget(arrayProxy: object[]): any {
            return globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_target_').value;
        }

        static setHandler(arrayProxy: object[], arrayHandler: ArrayHandler): void {
            globalThis.Object.defineProperty(arrayProxy, '_handler_', {
                value: arrayHandler,
                writable: true
            });
        }

        static getHandler(arrayProxy: object[]): ArrayHandler {
            let handler = globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_handler_').value;
            assert(handler, 'handler is not found');
            return handler;
        }

        static save(arrayProxy: object[]): void {
            let origin = JSON.stringify(arrayProxy);
            globalThis.Object.defineProperty(arrayProxy, '_origin_', {
                value: origin,
                writable: true
            });
        }

        static reset(arrayProxy: object[]): void {
            let origin = JSON.parse(globalThis.Object.getOwnPropertyDescriptor(arrayProxy,'_origin_').value);
            this.assign(arrayProxy, origin);
        }

        static onPropertyChanging(arrayProxy: object[], listener: Function): void {
            this.getHandler(arrayProxy).propertyChangingListener = listener;
            arrayProxy.forEach(objectProxy => {
                ObjectProxy.getHandler(objectProxy).propertyChangingListener = listener;
            });
        }

        static onPropertyChanged(arrayProxy: object[], listener: Function): void {
            this.getHandler(arrayProxy).propertyChangedListener = listener;
            arrayProxy.forEach(objectProxy => {
                ObjectProxy.getHandler(objectProxy).propertyChangedListener = listener;
            });
        }

        static onRowInserting(arrayProxy: object[], listener: Function): void {
            this.getHandler(arrayProxy).rowInsertingListener = listener;
        }

        static onRowInserted(arrayProxy: object[], listener: Function): void {
            this.getHandler(arrayProxy).rowInsertedListener = listener;
        }

        static onRowDeleting(arrayProxy: object[], listener: Function): void {
            this.getHandler(arrayProxy).rowDeletingListener = listener;
        }

        static onRowDeleted(arrayProxy: object[], listener: Function): void {
            this.getHandler(arrayProxy).rowDeletedListener = listener;
        }

        static setReadonly(arrayProxy: object[], property: string, readonly: boolean): void {
            this.getHandler(arrayProxy).setReadonly(property, readonly);
        }

        static isReadonly(arrayProxy: object[], property: string): boolean {
             return this.getHandler(arrayProxy).isReadonly(property);
        }

        static setReadonlyAll(arrayProxy: object[], readonly: boolean): void {
            this.getHandler(arrayProxy).setReadonlyAll(readonly);
            for(let index = 0; index >= this.length; index ++ ){
                 ObjectProxy.setReadonlyAll(this[index], readonly);
            }
        }

        static isReadonlyAll(arrayProxy: object[]): boolean {
            return this.getHandler(arrayProxy).isReadonlyAll();
        }

        static setDisable(arrayProxy: object[], property: string, disable: boolean): void {
            this.getHandler(arrayProxy).setDisable(property, disable);
        }

        static isDisable(arrayProxy: object[], property): boolean {
            return this.getHandler(arrayProxy).isDisable(property);
        }

        static setDisableAll(arrayProxy: object[], disable: boolean): void {
            this.getHandler(arrayProxy).setDisableAll(disable);
            for(let index = 0; index >= this.length; index ++ ){
                ObjectProxy.setDisableAll(this[index], disable);
            }
        }

        static isDisableAll(arrayProxy: object[]): boolean {
            return this.getHandler(arrayProxy).isDisableAll();
        }

        static selectItem(arrayProxy: object[], index: number): void {
            return this.getHandler(arrayProxy).selectItem(index);
        }

        static getSelectedItemIndex(arrayProxy: object[]): number {
            return this.getHandler(arrayProxy).getSelectedItemIndex();
        }

    }

}
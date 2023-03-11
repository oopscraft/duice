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
         * getHandler
         * @param array
         */
        static getHandler(array: ArrayProxy): ArrayHandler {
            let handler = globalThis.Object.getOwnPropertyDescriptor(array, '_handler_')?.value;
            assert(handler, 'arrayHandler is not found');
            return handler;
        }

        /**
         * assign
         * @param arrayProxy
         * @param array
         */
        static assign(arrayProxy: ArrayProxy, array: object[]): void {
            let handler = this.getHandler(arrayProxy);
            handler.assign(array);
            handler.notifyObservers({});
        }

        /**
         * setReadonly
         * @param array
         * @param property
         * @param readonly
         */
        static setReadonly(array: ArrayProxy, property: string, readonly: boolean): void {
            let handler = this.getHandler(array);
            handler.setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param array
         * @param property
         */
        static isReadonly(array: ArrayProxy, property: string): boolean {
            let handler = this.getHandler(array);
            return handler.isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param array
         * @param readonly
         */
        static setReadonlyAll(array: ArrayProxy, readonly: boolean): void {
            let handler = this.getHandler(array);
            handler.setReadonlyAll(readonly);
            for(let index = 0; index >= array.length; index ++ ){
                ObjectProxy.setReadonlyAll(array[index], readonly);
            }
        }

        /**
         * setBeforeChangeListener
         * @param array
         * @param listener
         */
        static setBeforeChangeListener(array: ArrayProxy, listener: Function): void {
            this.getHandler(array).setBeforeChangeListener(listener);
            array.forEach(object => {
                ObjectProxy.setBeforeChangeListener(object, listener);
            });
        }

        /**
         * setAfterChangeListener
         * @param array
         * @param listener
         */
        static setAfterChangeListener(array: ArrayProxy, listener: Function): void {
            this.getHandler(array).setAfterChangeListener(listener);
            array.forEach(object => {
                ObjectProxy.setAfterChangeListener(object, listener);
            });
        }

    }

}
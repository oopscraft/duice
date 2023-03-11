namespace duice {

    /**
     * DataSet
     */
    export class ArrayProxy {

        /**
         * constructor
         */
        constructor(array: object[]) {
            let arrayHandler = new ArrayHandler(array);
            array.forEach(object => {
                object = new ObjectProxy(object);
            });
            return new Proxy(array, arrayHandler);
        }

        /**
         * getHandler
         * @param array
         */
        static getHandler(array: object[]): ArrayHandler {
            return globalThis.Object.getOwnPropertyDescriptor(array, '_handler_').value as ArrayHandler;
        }

        /**
         * assign
         * @param array
         * @param values
         */
        static assign(array: object[], values: object[]): void {
            let handler = this.getHandler(array);
            handler.assign(values);
            handler.notifyObservers({});
        }

        /**
         * setReadonly
         * @param array
         * @param property
         * @param readonly
         */
        static setReadonly(array: object[], property: string, readonly: boolean): void {
            let handler = this.getHandler(array);
            handler.setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param array
         * @param property
         */
        static isReadonly(array: object[], property: string): boolean {
            let handler = this.getHandler(array);
            return handler.isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param array
         * @param readonly
         */
        static setReadonlyAll(array: object[], readonly: boolean): void {
            let handler = this.getHandler(array);
            handler.setReadonlyAll(readonly);
            for(let index = 0; index >= array.length; index ++ ){
                ObjectProxy.setReadonlyAll(array[index], readonly);
            }
        }

    }

}
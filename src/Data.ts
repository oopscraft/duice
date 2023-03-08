namespace duice {

    /**
     * Data
     */
    export class Data extends globalThis.Object {

        /**
         * create
         * @param object
         */
        static create(object: object): any {
            let data = new Data(object);
            let dataHandler = new DataHandler(data);

            // _handler_
            globalThis.Object.defineProperty(data, "_handler_", {
                value: dataHandler,
                writable: true
            });

            // return this as proxy instance
            return new Proxy(data, dataHandler);
        }

        /**
         * constructor
         * @param object
         */
        private constructor(object: object) {
            super();
            Data.internalAssign(this, object);
        }

        /**
         * getHandler
         * @param data
         */
        static getHandler(data: Data): DataHandler {
            return Object.getOwnPropertyDescriptor(data, '_handler_').value as DataHandler;
        }

        /**
         * internalAssign
         * @param object
         * @param data
         */
        static internalAssign(data: Data, object: object): Data {
            for(let property in data){
                Reflect.deleteProperty(data, property);
            }
            for(let property in object){
                let value = Reflect.get(object, property);
                Reflect.set(data, property, value);
            }
            return data;
        }

        /**
         * assign
         * @param data
         * @param object
         */
        static assign(data: Data, object: object): Data {
            Data.internalAssign(data, object);
            Data.notify(data);
            return data;
        }

        /**
         * notify
         * @param data
         */
        static notify(data: Data): void {
            let handler = this.getHandler(data);
            handler.notifyObservers({});
        }

        /**
         * setReadonly
         * @param data
         * @param property
         * @param readonly
         */
        static setReadonly(data: Data, property: string, readonly: boolean): void {
            let handler = this.getHandler(data);
            handler.setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param data
         * @param property
         */
        static isReadonly(data: Data, property: string): boolean {
            let handler = this.getHandler(data);
            return handler.isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param data
         * @param readonly
         */
        static setReadonlyAll(data: Data, readonly: boolean): void {
            let handler = this.getHandler(data);
            handler.setReadonlyAll(readonly);
            for(let property in this) {
                handler.setReadonly(property, readonly);
            }
        }

        /**
         * onBeforeChange
         * @param data
         * @param listener
         */
        static onBeforeChange(data: Data, listener: Function): void {
            let handler = this.getHandler(data);
            handler.onBeforeChange(listener);
        }

        /**
         * onAfterChange
         * @param data
         * @param listener
         */
        static onAfterChange(data: Data, listener: Function): void {
            let handler = this.getHandler(data);
            handler.onAfterChange(listener);
        }

    }
}
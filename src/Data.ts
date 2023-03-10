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
            let data = new Data();
            let dataHandler = new DataHandler(data);
            dataHandler.assign(object);
            return new Proxy(data, dataHandler);
        }

        /**
         * getHandler
         * @param data
         */
        static getHandler(data: Data): DataHandler {
            return Object.getOwnPropertyDescriptor(data, '_handler_').value as DataHandler;
        }

        /**
         * assign
         * @param data
         * @param object
         */
        static assign(data: Data, object: object): Data {
            let handler = this.getHandler(data);
            handler.assign(object);
            handler.notifyObservers({});
            return data;
        }

        /**
         * isDirty
         * @param data
         */
        static isDirty(data: Data): boolean {
            return this.getHandler(data).isDirty();
        }

        /**
         * reset
         * @param data
         */
        static reset(data: Data): void {
            this.getHandler(data).reset();
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
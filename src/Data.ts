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
            globalThis.Object.defineProperty(data, "_handler_", {
                value: dataHandler,
                writable: true
            });
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
            let handler = Object.getOwnPropertyDescriptor(data, '_handler_').value;
            handler.notifyObservers({});
        }

    }
}
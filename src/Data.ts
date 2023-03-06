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
            this.copy(object);
        }

        static test():void {

        }

        /**
         * load
         * @param object
         */
        copy(object: object): void {
            for(let property in this){
                delete this[property];
            }
            for(let property in object){
                let value = object[property];
                this[property] = value;
            }
        }

        /**
         * fromJson
         * @param object
         */
        fromJson(object: object): void {
            this.copy(object);
            let handler = Object.getOwnPropertyDescriptor(this, '_handler_').value;
            handler.notifyObservers({});
        }

        /**
         * toJson
         */
        toJson(): string {
            return JSON.stringify(this);
        }

    }
}
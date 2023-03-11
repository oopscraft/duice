namespace duice {

    /**
     * Data
     */
    export class ObjectProxy {

        /**
         * constructor
         */
        public constructor(object: object) {
            let objectHandler = new ObjectHandler(object);
            return new Proxy(object, objectHandler);
        }

        /**
         * getHandler
         * @param data
         */
        static getHandler(object: object): ObjectHandler {
            return globalThis.Object.getOwnPropertyDescriptor(object, '_handler_').value as ObjectHandler;
        }

        /**
         * assign
         * @param object
         * @param value
         */
        static assign(object: object, value: object): void {
            let handler = this.getHandler(object);
            handler.assign(value);
            handler.notifyObservers({});
        }

        /**
         * setReadonly
         * @param object
         * @param property
         * @param readonly
         */
        static setReadonly(object: object, property: string, readonly: boolean): void {
            let handler = this.getHandler(object);
            handler.setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param object
         * @param property
         */
        static isReadonly(object: object, property: string): boolean {
            let handler = this.getHandler(object);
            return handler.isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param object
         * @param readonly
         */
        static setReadonlyAll(object: object, readonly: boolean): void {
            let handler = this.getHandler(object);
            handler.setReadonlyAll(readonly);
            for(let property in this) {
                handler.setReadonly(property, readonly);
            }
        }

        /**
         * isDirty
         * @param object
         */
        static isDirty(object: object): boolean {
            return this.getHandler(object).isDirty();
        }

        /**
         * reset
         * @param object
         */
        static reset(object: object): void {
            this.getHandler(object).reset();
        }

        /**
         * onBeforeChange
         * @param object
         * @param listener
         */
        static onBeforeChange(object: object, listener: Function): void {
            let handler = this.getHandler(object);
            handler.onBeforeChange(listener);
        }

        /**
         * onAfterChange
         * @param object
         * @param listener
         */
        static onAfterChange(object: object, listener: Function): void {
            let handler = this.getHandler(object);
            handler.onAfterChange(listener);
        }

    }
}
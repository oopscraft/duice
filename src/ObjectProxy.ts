namespace duice {

    /**
     * ObjectProxy
     */
    export class ObjectProxy extends globalThis.Object {

        /**
         * constructor
         */
        public constructor(object?: object) {
            super();

            // copy property
            if(typeof object === 'object'){
                for(let property in object){
                    this[property] = object[property];
                }
            }

            // return proxy instance
            let objectHandler = new ObjectHandler(this);
            return new Proxy<ObjectProxy>(this, objectHandler);
        }

        /**
         * getHandler
         * @param objectProxy
         */
        static getHandler(objectProxy: ObjectProxy): ObjectHandler {
            let objectHandler = globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_handler_')?.value;
            assert(objectHandler, 'objectHandler is not found');
            return objectHandler;
        }

        /**
         * assign
         * @param objectProxy
         * @param object
         */
        static assign(objectProxy: ObjectProxy, object: object): void {
            let handler = this.getHandler(objectProxy);
            handler.assign(object);
        }

        /**
         * setReadonly
         * @param objectProxy
         * @param property
         * @param readonly
         */
        static setReadonly(objectProxy: ObjectProxy, property: string, readonly: boolean): void {
            let objectHandler = this.getHandler(objectProxy);
            objectHandler.setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param objectProxy
         * @param property
         */
        static isReadonly(objectProxy: ObjectProxy, property: string): boolean {
            let objectHandler = this.getHandler(objectProxy);
            return objectHandler.isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param objectProxy
         * @param readonly
         */
        static setReadonlyAll(objectProxy: ObjectProxy, readonly: boolean): void {
            let objectHandler = this.getHandler(objectProxy);
            objectHandler.setReadonlyAll(readonly);
            for(let property in this) {
                objectHandler.setReadonly(property, readonly);
            }
        }

        /**
         * isDirty
         * @param objectProxy
         */
        static isDirty(objectProxy: ObjectProxy): boolean {
            return this.getHandler(objectProxy).isDirty();
        }

        /**
         * reset
         * @param objectProxy
         */
        static reset(objectProxy: ObjectProxy): void {
            this.getHandler(objectProxy).reset();
        }

        /**
         * onPropertyChanging
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanging(objectProxy: ObjectProxy, listener: Function): void {
            this.getHandler(objectProxy).setPropertyChangingListener(listener);
        }

        /**
         * onPropertyChanged
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanged(objectProxy: ObjectProxy, listener: Function): void {
            this.getHandler(objectProxy).setPropertyChangedListener(listener);
        }

    }
}
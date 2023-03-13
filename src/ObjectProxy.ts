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
         * assign
         * @param objectProxy
         * @param object
         */
        static assign(objectProxy: ObjectProxy, object: object): void {
            let handler = getHandler(objectProxy);
            handler.assign(object);
        }

        /**
         * setReadonly
         * @param objectProxy
         * @param property
         * @param readonly
         */
        static setReadonly(objectProxy: ObjectProxy, property: string, readonly: boolean): void {
            let objectHandler = getHandler(objectProxy);
            objectHandler.setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param objectProxy
         * @param property
         */
        static isReadonly(objectProxy: ObjectProxy, property: string): boolean {
            let objectHandler = getHandler(objectProxy);
            return objectHandler.isReadonly(property);
        }

        /**
         * setReadonlyAll
         * @param objectProxy
         * @param readonly
         */
        static setReadonlyAll(objectProxy: ObjectProxy, readonly: boolean): void {
            let objectHandler = getHandler(objectProxy);
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
            return getHandler(objectProxy).isDirty();
        }

        /**
         * reset
         * @param objectProxy
         */
        static reset(objectProxy: ObjectProxy): void {
            getHandler(objectProxy).reset();
        }

        /**
         * onPropertyChanging
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanging(objectProxy: ObjectProxy, listener: Function): void {
            getHandler(objectProxy).setPropertyChangingListener(listener);
        }

        /**
         * onPropertyChanged
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanged(objectProxy: ObjectProxy, listener: Function): void {
            getHandler(objectProxy).setPropertyChangedListener(listener);
        }

    }
}
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
            let handler = new ObjectHandler(this);
            return new Proxy<ObjectProxy>(this, handler);
        }

        /**
         * getHandler
         * @param objectProxy
         */
        static getHandler(objectProxy: ObjectProxy): ObjectHandler {
            return Handler.getHandler<ObjectProxy, ObjectHandler>(objectProxy);
        }

        /**
         * assign
         * @param objectProxy
         * @param object
         */
        static assign(objectProxy: ObjectProxy, object: object): void {
            this.getHandler(objectProxy).assign(object);
        }

        /**
         * setReadonly
         * @param objectProxy
         * @param property
         * @param readonly
         */
        static setReadonly(objectProxy: ObjectProxy, property: string, readonly: boolean): void {
            this.getHandler(objectProxy).setReadonly(property, readonly);
        }

        /**
         * isReadonly
         * @param objectProxy
         * @param property
         */
        static isReadonly(objectProxy: ObjectProxy, property: string): boolean {
            return this.getHandler(objectProxy).isReadonly(property);
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
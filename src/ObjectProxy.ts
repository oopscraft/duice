namespace duice {

    /**
     * ObjectProxy
     */
    export class ObjectProxy extends globalThis.Object {

        /**
         * constructor
         */
        public constructor(object: object) {
            super();

            // object handler
            let objectHandler = new ObjectHandler();

            // copy property
            for (let name in object) {
                let value = object[name];

                // value is array
                if(Array.isArray(value)){
                    let arrayProxy = new ArrayProxy(value);
                    ArrayProxy.getHandler(arrayProxy).addObserver(objectHandler);
                    this[name] = arrayProxy;
                    continue;
                }

                // value is object
                if(typeof value === 'object'){
                    let objectProxy = new ObjectProxy(value);
                    ObjectProxy.getHandler(objectProxy).addObserver(objectHandler);
                    this[name] = objectProxy;
                    continue;
                }

                // value is primitive
                this[name] = value;
            }

            // delete not exists property
            for(let name in this){
                if(!Object.keys(object).includes(name)){
                    delete this[name];
                }
            }

            // creates proxy
            let objectProxy = new Proxy<ObjectProxy>(this, objectHandler);
            objectHandler.setTarget(objectProxy);

            // set property
            ObjectProxy.setHandler(objectProxy, objectHandler);
            ObjectProxy.setTarget(objectProxy, this);

            // returns
            return objectProxy;
        }

        /**
         * assign
         * @param objectProxy
         * @param object
         */
        static assign(objectProxy: ObjectProxy, object: object): void {
            let objectHandler = this.getHandler(objectProxy);
            try {

                // suspend
                objectHandler.suspendListener()
                objectHandler.suspendNotify();

                // loop object properties
                for(let name in object){
                    let value = object[name];

                    // source value is array
                    if(Array.isArray(value)){
                        if(Array.isArray(objectProxy[name])){
                            ArrayProxy.assign(objectProxy[name], value);
                        }else{
                            objectProxy[name] = new ArrayProxy(value);
                        }
                        continue;
                    }

                    // source value is object
                    if(typeof value === 'object'){
                        if(typeof objectProxy[name] === 'object'){
                            ObjectProxy.assign(objectProxy[name], value);
                        }else{
                            let objectProxy = new ObjectProxy(value);
                            ObjectProxy.getHandler(objectProxy).addObserver(objectHandler);
                            objectProxy[name] = objectProxy;
                        }
                        continue;
                    }

                    // source value is primitive
                    objectProxy[name] = value;
                }

            } finally {
                // resume
                objectHandler.resumeListener();
                objectHandler.resumeNotify();
            }

            // notify observers
            objectHandler.notifyObservers(new Event(this));
        }

        /**
         * setTarget
         * @param objectProxy
         * @param target
         */
        static setTarget(objectProxy: ObjectProxy, target: object): void {
            globalThis.Object.defineProperty(objectProxy, '_target_', {
                value: target,
                writable: true
            });
        }

        /**
         * getTarget
         * @param objectProxy
         */
        static getTarget(objectProxy: ObjectProxy): any {
            return globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_target_').value;
        }

        /**
         * setHandler
         * @param objectProxy
         * @param objectHandler
         */
        static setHandler(objectProxy: ObjectProxy, objectHandler: ObjectHandler): void {
            globalThis.Object.defineProperty(objectProxy, '_handler_', {
                value: objectHandler,
                writable: true
            });
        }

        /**
         * getHandler
         * @param objectProxy
         */
        static getHandler(objectProxy: ObjectProxy): ObjectHandler {
            let handler = globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_handler_').value;
            assert(handler, 'handler is not found');
            return handler;
        }

        /**
         * onPropertyChanging
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanging(objectProxy: ObjectProxy, listener: Function): void {
            this.getHandler(objectProxy).propertyChangingListener = listener;
        }

        /**
         * onPropertyChanged
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanged(objectProxy: ObjectProxy, listener: Function): void {
            this.getHandler(objectProxy).propertyChangedListener = listener;
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

    }

}
namespace duice {

    /**
     * object proxy class
     */
    export class ObjectProxy extends globalThis.Object implements DataProxy {

        /**
         * constructor
         */
        public constructor(object: globalThis.Object) {
            super();

            // object handler
            let objectHandler = new ObjectHandler();

            // copy property
            for (let name in object) {
                let value = object[name];

                // value is array
                if(ArrayProxy.isArray(value)){
                    let arrayProxy = new ArrayProxy(value);
                    ArrayProxy.getHandler(arrayProxy).addObserver(objectHandler);
                    this[name] = arrayProxy;
                    continue;
                }

                // value is object
                if(value != null && typeof value === 'object'){
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
                if(!ObjectProxy.keys(object).includes(name)){
                    delete this[name];
                }
            }

            // creates proxy
            let objectProxy = new Proxy<ObjectProxy>(this, objectHandler);
            objectHandler.setTarget(objectProxy);

            // set property
            ObjectProxy.setHandler(objectProxy, objectHandler);
            ObjectProxy.setTarget(objectProxy, this);

            // save
            ObjectProxy.save(objectProxy);

            // returns
            return objectProxy;
        }

        /**
         * clear
         * @param objectProxy
         */
        static clear(objectProxy: ObjectProxy): void {
            let objectHandler = this.getHandler(objectProxy);
            try {
                // suspend
                objectHandler.suspendListener();
                objectHandler.suspendNotify();

                // clear properties
                for(let name in objectProxy) {
                    let value = objectProxy[name];
                    if(ArrayProxy.isArray(value)) {
                        ArrayProxy.clear(value as ArrayProxy);
                        continue;
                    }
                    if(value != null && typeof value === 'object') {
                        ObjectProxy.clear(value);
                        continue;
                    }
                    objectProxy[name] = null;
                }

            } finally {
                // resume
                objectHandler.resumeListener();
                objectHandler.resumeNotify();
            }

            // notify observers
            objectHandler.notifyObservers(new event.Event(this));
        }

        /**
         * assign
         * @param objectProxy
         * @param object
         */
        static override assign(objectProxy: ObjectProxy, object: object): void {
            let objectHandler = this.getHandler(objectProxy);
            try {
                // suspend
                objectHandler.suspendListener()
                objectHandler.suspendNotify();

                // loop object properties
                for(let name in object) {
                    let value = object[name];

                    // source value is array
                    if(ArrayProxy.isArray(value)){
                        if(ArrayProxy.isArray(objectProxy[name])){
                            ArrayProxy.assign(objectProxy[name], value);
                        }else{
                            objectProxy[name] = new ArrayProxy(value);
                        }
                        continue;
                    }

                    // source value is object
                    if(value != null && typeof value === 'object'){
                        if(objectProxy[name] != null && typeof objectProxy[name] === 'object'){
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

                // save
                this.save(objectProxy);

            } finally {
                // resume
                objectHandler.resumeListener();
                objectHandler.resumeNotify();
            }

            // notify observers
            objectHandler.notifyObservers(new event.Event(this));
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
         * save
         * @param objectProxy
         */
        static save(objectProxy: ObjectProxy): void {
            let origin = JSON.stringify(objectProxy);
            globalThis.Object.defineProperty(objectProxy, '_origin_', {
                value: origin,
                writable: true
            });
        }

        /**
         * reset
         * @param objectProxy
         */
        static reset(objectProxy: ObjectProxy): void {
            let origin = JSON.parse(globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_origin_').value);
            this.assign(objectProxy, origin);
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
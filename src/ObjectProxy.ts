import {ObjectHandler} from "./ObjectHandler";
import {ArrayProxy} from "./ArrayProxy";
import {assert} from "./common";
import {DataEvent} from "./event/DataEvent";

export class ObjectProxy extends globalThis.Object {

    /**
     * constructor
     * @param object
     */
    public constructor(object: object) {
        super();

        // is already proxy
        if(ObjectProxy.isProxy(object)) {
            return object;
        }

        // object handler
        let objectHandler = new ObjectHandler();

        // copy property
        for (let name in object) {
            let value = object[name];

            // value is array
            if(Array.isArray(value)){
                let arrayProxy = new ArrayProxy(value);
                ArrayProxy.getHandler(arrayProxy as object[]).addObserver(objectHandler);
                object[name] = arrayProxy;
                continue;
            }

            // value is object
            if(value != null && typeof value === 'object'){
                let objectProxy = new ObjectProxy(value);
                ObjectProxy.getHandler(objectProxy).addObserver(objectHandler);
                object[name] = objectProxy;
                continue;
            }

            // value is primitive
            object[name] = value;
        }

        // delete not exists property
        for(let name in object){
            if(!Object.keys(object).includes(name)){
                delete this[name];
            }
        }

        // creates proxy
        let objectProxy = new Proxy<object>(object, objectHandler);
        objectHandler.setTarget(object);

        // set property
        ObjectProxy.setHandler(objectProxy, objectHandler);
        ObjectProxy.setTarget(objectProxy, object);

        // save
        ObjectProxy.save(objectProxy);

        // returns
        return objectProxy;
    }

    static isProxy(object: object): boolean {
        return object.hasOwnProperty('_target_');
    }

    static setTarget(objectProxy: object, target: object): void {
        globalThis.Object.defineProperty(objectProxy, '_target_', {
            value: target,
            writable: true
        });
    }

    static getTarget(objectProxy: object): any {
        return globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_target_').value;
    }

    static setHandler(objectProxy: object, objectHandler: ObjectHandler): void {
        globalThis.Object.defineProperty(objectProxy, '_handler_', {
            value: objectHandler,
            writable: true
        });
    }

    static getHandler(objectProxy: object): ObjectHandler {
        let handler = globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_handler_').value;
        assert(handler, 'handler is not found');
        return handler;
    }

    /**
     * Assign object to object proxy
     * @param objectProxy
     * @param object
     */
    static override assign(objectProxy: object, object: object): void {
        let objectHandler = this.getHandler(objectProxy);
        try {
            // suspend
            objectHandler.suspendListener()
            objectHandler.suspendNotify();

            // loop object properties
            for(let name in object) {
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
        } finally {
            // resume
            objectHandler.resumeListener();
            objectHandler.resumeNotify();
        }

        // notify observers
        objectHandler.notifyObservers(new DataEvent(this));
    }

    /**
     * Clear object properties
     * @param objectProxy
     */
    static clear(objectProxy: object): void {
        let objectHandler = this.getHandler(objectProxy);
        try {
            // suspend
            objectHandler.suspendListener();
            objectHandler.suspendNotify();

            // clear properties
            for(let name in objectProxy) {
                let value = objectProxy[name];
                if(Array.isArray(value)) {
                    ArrayProxy.clear(value as object[]);
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
        objectHandler.notifyObservers(new DataEvent(this));
    }

    /**
     * Save object properties
     * @param objectProxy
     */
    static save(objectProxy: object): void {
        let origin = JSON.stringify(objectProxy);
        globalThis.Object.defineProperty(objectProxy, '_origin_', {
            value: origin,
            writable: true
        });
    }

    /**
     * Reset object properties
     * @param objectProxy
     */
    static reset(objectProxy: object): void {
        let origin = JSON.parse(globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_origin_').value);
        this.assign(objectProxy, origin);
    }

    /**
     * Set property to be readonly
     * @param objectProxy
     * @param property
     * @param readonly
     */
    static setReadonly(objectProxy: object, property: string, readonly: boolean): void {
        this.getHandler(objectProxy).setReadonly(property, readonly);
    }

    /**
     * Get whether property is readonly
     * @param objectProxy
     * @param property
     */
    static isReadonly(objectProxy: object, property: string): boolean {
        return this.getHandler(objectProxy).isReadonly(property);
    }

    /**
     * Set all properties to be readonly
     * @param objectProxy
     * @param readonly
     */
    static setReadonlyAll(objectProxy: object, readonly: boolean): void {
        this.getHandler(objectProxy).setReadonlyAll(readonly);
    }

    /**
     * Get whether all properties are readonly
     * @param objectProxy
     */
    static isReadonlyAll(objectProxy: object): boolean {
        return this.getHandler(objectProxy).isReadonlyAll();
    }

    /**
     * Set object to be disabled
     * @param objectProxy
     * @param property
     * @param disable
     */
    static setDisable(objectProxy: object, property: string, disable: boolean): void {
        this.getHandler(objectProxy).setDisable(property, disable);
    }

    /**
     * Get whether property is disabled
     * @param objectProxy
     * @param property
     */
    static isDisable(objectProxy: object, property: string): boolean {
        return this.getHandler(objectProxy).isDisable(property);
    }

    /**
     * Set all properties to be disabled
     * @param objectProxy
     * @param disable
     */
    static setDisableAll(objectProxy: object, disable: boolean): void {
        this.getHandler(objectProxy).setDisableAll(disable);
    }

    /**
     * Get whether all properties are disabled
     * @param objectProxy
     */
    static isDisableAll(objectProxy: object): boolean {
        return this.getHandler(objectProxy).isDisableAll();
    }

    /**
     * Set property to be focused
     * @param objectProxy
     * @param property
     */
    static focus(objectProxy: object, property: string): void {
        this.getHandler(objectProxy).focus(property);
    }

    /**
     * Set readonly before changing event listener
     * @param objectProxy
     * @param listener
     */
    static onPropertyChanging(objectProxy: object, listener: Function): void {
        this.getHandler(objectProxy).propertyChangingListener = listener;
    }

    /**
     * Set property after changed event listener
     * @param objectProxy
     * @param listener
     */
    static onPropertyChanged(objectProxy: object, listener: Function): void {
        this.getHandler(objectProxy).propertyChangedListener = listener;
    }

}
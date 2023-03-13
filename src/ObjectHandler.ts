///<reference path="Observable.ts"/>
///<reference path="Observer.ts"/>
namespace duice {

    /**
     * ObjectHandler
     */
    export class ObjectHandler extends Observable implements Observer {

        objectProxy: ObjectProxy;

        originObject: object;

        readonlyAll: boolean = false;

        readonly: Set<string> = new Set<string>();

        listenerEnabled: boolean = true;

        propertyChangingListener: Function;

        propertyChangedListener: Function;

        /**
         * constructor
         * @param objectProxy
         */
        constructor(objectProxy: ObjectProxy) {
            super();
            this.objectProxy = objectProxy;

            // setting handler as property
            globalThis.Object.defineProperty(objectProxy, '_handler_', {
                value: this,
                writable: true
            });

            // save
            this.save();
        }

        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target: object, property: string, receiver: object): any {
            console.log("ObjectHandler.get", target, property, receiver);
            return Reflect.get(target, property, receiver);
        }

        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: object, property: string, value: any) {
            console.log("ObjectHandler.set", target, property, value);

            // try to change property value
            let event = new PropertyChangeEvent(this, property, value);
            this.checkListener(this.propertyChangingListener, event).then(result => {
                if(result){

                    // change value
                    Reflect.set(target, property, value);

                    // calls property changed listener
                    this.checkListener(this.propertyChangedListener, event).then(() => {
                        this.notifyObservers(event);
                    });
                }
            });

            // returns
            return true;
        }

        /**
         * assign
         * @param object
         */
        assign(object: object): void {
            try {
                // suspend
                this.suspendListener()
                this.suspendNotify();

                // deletes
                for (let property in this.objectProxy) {
                    delete this.objectProxy[property];
                }

                // assign
                for (let property in object) {
                    this.objectProxy[property] = object[property];
                }

                // saves origin object
                this.save();
            } finally {
                // resume
                this.resumeListener();
                this.resumeNotify();
            }

            // notify observers
            this.notifyObservers(new Event(this));
        }

        /**
         * update
         * @param element
         * @param event
         */
        async update(element: Element<any>, event: Event): Promise<void> {
            console.log("ObjectHandler.update", element, event);

            // if property change event
            if(event instanceof PropertyChangeEvent){
                let property = element.getProperty();
                let value = element.getValue();
                if(await this.checkListener(this.propertyChangingListener, event)){
                    this.setValue(property, value);
                    await this.checkListener(this.propertyChangedListener, event);
                }
            }

            // notify
            this.notifyObservers(event);
        }

        /**
         * save
         */
        save(): void {
            this.originObject = JSON.parse(JSON.stringify(this.objectProxy));
        }

        /**
         * reset
         */
        reset(): void {
            this.assign(this.originObject);
        }

        /**
         * isDirty
         */
        isDirty(): boolean {
            return JSON.stringify(this.objectProxy) !== JSON.stringify(this.originObject);
        }

        /**
         * getValue
         * @param property
         */
        getValue(property: string): any {
            property = property.replace('.','?.');
            return new Function(`return this.${property};`).call(this.objectProxy);
        }

        /**
         * setValue
         * @param property
         * @param value
         */
        setValue(property: string, value: any): void {
            new Function('value', `this.${property} = value;`).call(this.objectProxy, value);
        }

        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly: boolean): void {
            this.readonlyAll = readonly;
            this.notifyObservers(new Event(this));
        }

        /**
         * setReadonly
         * @param property
         * @param readonly
         */
        setReadonly(property: string, readonly: boolean): void {
            if(readonly){
                this.readonly.add(property);
            }else{
                this.readonly.delete(property);
            }
            this.notifyObservers(new Event(this));
        }

        /**
         * isReadonly
         * @param property
         */
        isReadonly(property: string): boolean {
            return this.readonlyAll || this.readonly.has(property);
        }

        /**
         * sets property changing event listener
         * @param listener
         */
        setPropertyChangingListener(listener: Function): void {
            this.propertyChangingListener = listener;
        }

        /**
         * sets property changed event listener
         * @param listener
         */
        setPropertyChangedListener(listener: Function): void {
            this.propertyChangedListener = listener;
        }

        /**
         * suspends listener
         */
        suspendListener(): void {
            this.listenerEnabled = false;
        }

        /**
         * resumes listener
         */
        resumeListener(): void {
            this.listenerEnabled = true;
        }

        /**
         * checkListener
         * @param listener
         * @param event
         */
        async checkListener(listener: Function, event: Event): Promise<boolean> {
            if(this.listenerEnabled && listener){
                let result = await listener.call(this.objectProxy, event);
                if(result == false){
                    return false;
                }
            }
            return true;
        }

    }

}
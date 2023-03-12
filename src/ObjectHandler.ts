///<reference path="Observable.ts"/>
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

        beforeChangeListener: Function;

        afterChangeListener: Function;

        /**
         * constructor
         * @param objectProxy
         */
        constructor(objectProxy: ObjectProxy) {
            super();
            this.objectProxy = objectProxy;
            this.save();
            globalThis.Object.defineProperty(objectProxy, "_handler_", {
                value: this,
                writable: true
            });
        }

        /**
         * getObjectProxy
         */
        getObjectProxy(): ObjectProxy {
            return this.objectProxy;
        }

        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target: object, property: string, receiver: object): any {
            console.log("- Object.get", target, property, receiver);
            return Reflect.get(target, property, receiver);
        }

        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: object, property: string, value: any) {
            console.log("- Object.set", target, property, value);

            // checks before change listener
            this.callBeforeChangeListener(property, value).then((result) => {
                if (result) {
                    // change property value
                    Reflect.set(target, property, value);

                    // calls after change listener
                    this.callAfterChangeListener(property, value).then();

                    // notify
                    this.notifyObservers({});
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
            this.notifyObservers({});
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
            console.assert(property);
            property = property.replace('.','?.');
            return new Function(`return this.${property};`).call(this.getObjectProxy());
        }

        /**
         * setValue
         * @param property
         * @param value
         */
        setValue(property: string, value: any): void {
            new Function('value', `this.${property} = value;`).call(this.getObjectProxy(), value);
        }

        /**
         * update
         * @param element
         * @param detail
         */
        async update(element: Element<any>, detail: any): Promise<void> {
            console.log("DataHandler.update", element, detail);
            let property = element.getProperty();
            if(property){
                let value = element.getValue();

                // calls before change listener
                if(await this.callBeforeChangeListener(property, value)){

                    // change property value
                    this.setValue(property, value);

                    // calls after change listener
                    await this.callAfterChangeListener(property, value);
                }
            }

            // notify
            this.notifyObservers(detail);
        }

        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly: boolean): void {
            this.readonlyAll = readonly;
            this.notifyObservers({});
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
            this.notifyObservers({});
        }

        /**
         * isReadonly
         * @param property
         */
        isReadonly(property: string): boolean {
            return this.readonlyAll || this.readonly.has(property);
        }

        /**
         * setBeforeChangeListener
         * @param listener
         */
        setBeforeChangeListener(listener: Function): void {
            this.beforeChangeListener = listener;
        }

        /**
         * setAfterChangeListener
         * @param listener
         */
        setAfterChangeListener(listener: Function): void {
            this.afterChangeListener = listener;
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
         * callBeforeChangeListener
         * @param property
         * @param value
         */
        async callBeforeChangeListener(property: string, value: any): Promise<boolean> {
            if(this.listenerEnabled && this.beforeChangeListener) {
                let result = await this.beforeChangeListener.call(this.getObjectProxy(), property, value);
                if(result === false){
                    return false;
                }
            }
            return true;
        }

        /**
         * callAfterChangeListener
         * @param property
         * @param value
         */
        async callAfterChangeListener(property: string, value: any): Promise<void> {
            if(this.listenerEnabled && this.afterChangeListener){
                await this.afterChangeListener.call(this.getObjectProxy(), property, value);
            }
        }

    }

}
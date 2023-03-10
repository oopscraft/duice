///<reference path="Observable.ts"/>
namespace duice {

    /**
     * DataHandler
     */
    export class DataHandler extends Observable implements Observer {

        data: Data;

        originData: object;

        readonlyAll: boolean = false;

        readonly: Set<string> = new Set<string>();

        listenerEnabled: boolean = true;

        beforeChangeListener: Function;

        afterChangeListener: Function;

        /**
         * constructor
         * @param data
         */
        constructor(data: Data){
            super();
            this.data = data;
            globalThis.Object.defineProperty(data, "_handler_", {
                value: this,
                writable: true
            });
        }

        /**
         * getData
         */
        getData(): Data {
            return this.data;
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
            this.callBeforeChange(property, value).then((result)=>{
                if(result){
                    // change property value
                    Reflect.set(target, property, value);

                    // calls after change listener
                    this.callAfterChange(property, value).then();

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
                for (let property in this.data) {
                    delete this.data[property];
                }

                // assign
                for (let property in object) {
                    this.data[property] = object[property];
                }

                // copy origin data
                this.originData = JSON.parse(JSON.stringify(this.data));

            }finally{
                // resume
                this.resumeListener();
                this.resumeNotify();
            }

            // notify observers
            this.notifyObservers({});
        }

        /**
         * isDirty
         */
        isDirty(): boolean {
            return JSON.stringify(this.data) !== JSON.stringify(this.originData);
        }

        /**
         * reset
         */
        reset(): void {
            this.assign(this.originData);
        }

        /**
         * getValue
         * @param property
         */
        getValue(property: string): any {
            console.assert(property);
            property = property.replace('.','?.');
            return new Function(`return this.${property};`).call(this.getData());
        }

        /**
         * setValue
         * @param property
         * @param value
         */
        setValue(property: string, value: any): void {
            new Function('value', `this.${property} = value;`).call(this.getData(), value);
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
                if(await this.callBeforeChange(property, value)){

                    // change property value
                    this.setValue(property, value);

                    // calls after change listener
                    await this.callAfterChange(property, value);
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
         * onBeforeChange
         * @param listener
         */
        onBeforeChange(listener: Function): void {
            this.beforeChangeListener = listener;
        }

        /**
         * onAfterChange
         * @param listener
         */
        onAfterChange(listener: Function): void {
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
         * callBeforeChange
         * @param property
         * @param value
         */
        async callBeforeChange(property: string, value: any): Promise<boolean> {
            if(this.listenerEnabled && this.beforeChangeListener) {
                let result = await this.beforeChangeListener.call(this.getData(), property, value);
                if(result === false){
                    return false;
                }
            }
            return true;
        }

        /**
         * callAfterChange
         * @param property
         * @param value
         */
        async callAfterChange(property: string, value: any): Promise<void> {
            if(this.listenerEnabled && this.afterChangeListener){
                await this.afterChangeListener.call(this.getData(), property, value);
            }
        }

    }

}
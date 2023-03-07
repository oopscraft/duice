namespace duice {

    /**
     * DataHandler
     */
    export class DataHandler extends Observable implements Observer {

        data: Data;

        readonlyAll: boolean = false;

        readonly: Set<string> = new Set<string>();

        beforeChangeListener: Function;

        afterChangeListener: Function;

        /**
         * constructor
         * @param data
         */
        constructor(data: Data){
            super();
            this.data = data;
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

            // check before change listener
            if(!this.callBeforeChangeListener(property, value)){
                return true;
            }

            // change property value
            Reflect.set(target, property, value);

            // notify
            this.notifyObservers({});

            // returns
            return true;
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
        update(element: Element<any>, detail: any): void {
            console.log("DataHandler.update", element, detail);
            let property = element.getProperty();
            if(property){

                // change property value
                let value = element.doGetValue();
                this.setValue(property, value);

                // calls after change listener
                this.callAfterChangeListener(property, value);
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
         * callBeforeChangeListener
         * @param property
         * @param value
         */
        callBeforeChangeListener(property: string, value: any): boolean {
            if(this.beforeChangeListener) {
                if(!this.beforeChangeListener.call(this.getData(), property, value)) {
                    return false;
                }
            }
            return true;
        }

        /**
         * setAfterChangeListener
         * @param listener
         */
        setAfterChangeListener(listener: Function): void {
            this.afterChangeListener = listener;
        }

        /**
         * callAfterChangeListener
         * @param property
         * @param value
         */
        callAfterChangeListener(property: string, value: any): void {
            if(this.afterChangeListener){
                this.afterChangeListener.call(this.getData(), property, value);
            }
        }

    }

}
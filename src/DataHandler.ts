///<reference path="Observable.ts"/>
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
         * callBeforeChange
         * @param property
         * @param value
         */
        async callBeforeChange(property: string, value: any): Promise<boolean> {
            if(this.beforeChangeListener) {
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
            if(this.afterChangeListener){
                await this.afterChangeListener.call(this.getData(), property, value);
            }
        }

    }

}
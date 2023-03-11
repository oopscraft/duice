///<reference path="Observable.ts"/>
namespace duice {

    /**
     * ArrayHandler
     */
    export class ArrayHandler extends Observable implements Observer {

        array: object[];

        readonlyAll: boolean = false;

        readonly: Set<string> = new Set<string>();

        /**
         * constructor
         * @param array
         */
        constructor(array: object[]) {
            super();
            this.array = array;
            globalThis.Object.defineProperty(array, '_handler_', {
                value: this,
                writable: true
            });
        }

        /**
         * getArray
         */
        getArray(): object[] {
            return this.array;
        }

        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: object, property: string, value: any): boolean {
            console.log("- Array.set", target, property, value);
            Reflect.set(target, property, value);
            if(property === 'length'){
                this.notifyObservers({});
            }
            return true;
        }

        /**
         * assign
         * @param array
         */
        assign(array: object[]): void {
            try {
                // suspend
                this.suspendNotify();

                // deletes
                this.array.length = 0;

                // assign
                for(let i = 0, size = array.length; i < size; i ++){
                    this.array[i] = new duice.ObjectProxy(array[i]);
                }

            }finally{
                // resume
                this.resumeNotify();
            }

            // notify observers
            this.notifyObservers({});
        }

        /**
         * update
         * @param elementSet
         * @param detail
         */
        update(elementSet: ElementSet<any>, detail: any): void {
            console.log("DataSetHandler", elementSet, detail);
            if(detail.name === 'changeIndex'){
                let data = this.array.splice(detail.fromIndex,1)[0];
                this.array.splice(detail.toIndex, 0, data);
            }
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

    }

}
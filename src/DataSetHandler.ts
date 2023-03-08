namespace duice {

    /**
     * DataSetHandler
     */
    export class DataSetHandler extends Observable implements Observer {

        dataSet: DataSet;

        readonlyAll: boolean = false;

        readonly: Set<string> = new Set<string>();

        /**
         * constructor
         * @param dataSet
         */
        constructor(dataSet: DataSet) {
            super();
            this.dataSet = dataSet;
        }

        /**
         * getDataSet
         */
        getDataSet(): DataSet {
            return this.dataSet;
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
         * update
         * @param elementSet
         * @param detail
         */
        update(elementSet: ElementSet<any>, detail: any): void {
            console.log("DataSetHandler", elementSet, detail);
            if(detail.name === 'changeIndex'){
                let data = this.dataSet.splice(detail.fromIndex,1)[0];
                this.dataSet.splice(detail.toIndex, 0, data);
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
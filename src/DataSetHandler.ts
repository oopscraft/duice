namespace duice {

    /**
     * DataSetHandler
     */
    export class DataSetHandler extends Observable implements Observer {

        dataSet: DataSet;

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
            console.log("DataSetHandler", element, detail);
            if(detail.name === 'changeIndex'){
                let data = this.dataSet.splice(detail.fromIndex,1)[0];
                this.dataSet.splice(detail.toIndex, 0, data);
            }
            this.notifyObservers(detail);
        }


    }

}
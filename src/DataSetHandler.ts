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
        update(elementSet: ElementSet, detail: any): void {

        }


    }

}
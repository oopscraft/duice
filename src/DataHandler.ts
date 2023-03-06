namespace duice {

    /**
     * DataHandler
     */
    export class DataHandler extends Observable implements Observer {

        data: Data;

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
            Reflect.set(target, property, value);
            this.notifyObservers({});
            return true;
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
                let value = element.getValue();
                setPropertyValue(this.getData(), property, value);
            }
            this.notifyObservers(detail);
        }

    }

}
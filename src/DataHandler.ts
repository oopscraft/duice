namespace duice {

    /**
     * DataHandler
     */
    export class DataHandler extends Observable implements Observer {

        data: object;

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
        update(element: Element, detail: any): void {
            console.log("Data.update", element, detail);
            let property = element.getProperty();
            if(property){
                let value = element.getValue();
                this.setPropertyValue(property, value);
            }
            this.notifyObservers(detail);
        }

        /**
         * getPropertyValue
         * @param property
         */
        getPropertyValue(property: string): any {
            console.assert(property);
            property = property.replace('.','?.');
            return new Function(`return this.${property};`).call(this.getData());
        }

        /**
         * setPropertyValue
         * @param property
         * @param value
         */
        setPropertyValue(property: string, value: any): void {
            new Function(`this.${property} = arguments[0];`).call(this.getData(), value);
        }


    }

}
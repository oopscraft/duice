namespace duice {

    /**
     * ObjectHandler
     */
    export class ObjectHandler extends Handler<object> {

        /**
         * constructor
         * @param target
         */
        constructor(object:Object) {
            super(object);
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
            this.notifyComponents({});
            return true;
        }

        /**
         * update
         * @param component
         * @param detail
         */
        update(component: ObjectComponent, detail: object): void {
            console.log('ObjectHandler.update', component, detail);
            let property = component.getProperty();
            let value = component.getValue();
            this.setPropertyValue(property, value);
        }

        /**
         * getPropertyValue
         * @param property
         */
        getPropertyValue(property: string): any {
            console.assert(property);
            property = property.replace('.','?.');
            return new Function(`return this.${property};`).call(this.getTarget());
        }

        /**
         * setPropertyValue
         * @param property
         * @param value
         */
        setPropertyValue(property: string, value: any): void {
            new Function(`this.${property} = arguments[0];`).call(this.getTarget(), value);
        }


    }

}
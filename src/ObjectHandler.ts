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
            this.notifyObservers({});
            return true;
        }

        /**
         * update
         * @param component
         * @param detail
         */
        update(component: ObjectComponent, detail: object): void {
            let property = component.getProperty();
            let value = component.getValue();
            Reflect.set(this.getTarget(), property, value);
        }

    }

}
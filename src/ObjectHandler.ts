namespace duice {

    /**
     * ObjectHandler
     */
    export class ObjectHandler extends Handler {

        /**
         * constructor
         * @param object
         */
        constructor(object: Object) {
            super(object);
        }

        /**
         * set
         * @param name
         * @param value
         */
        set(name: string, value: any): void {
            this.getTarget().set
            Reflect.set(this.getTarget(), name, value);
            this.notifyObservers(new duice.event.ValueChangeEvent(name, value));
        }

        /**
         * get
         * @param name
         */
        get(name: string) {
            return Reflect.get(this.getTarget(), name);
        }

        /**
         * doUpdate
         * @param objectComponent
         * @param event
         */
        doUpdate(objectComponent: ObjectComponent, event: duice.event.Event): void {

        }
    }
}
///<reference path="Handler.ts"/>
///<reference path="event/Event.ts"/>
namespace duice {

    import ValueChangeEvent = duice.event.ValueChangeEvent;

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
            Reflect.set(this.getTarget(), name, value);
            this.notifyObservers(new ValueChangeEvent(
                name, value
            ));
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
        doUpdate(objectComponent: ObjectComponent, event: duice.Event): void {

        }
    }
}
///<reference path="Handler.ts"/>
///<reference path="Event.ts"/>
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

        update(objectComponent: ObjectComponent, event: object): void {
            console.debug('ObjectHandler.update', objectComponent, event);
            let name = objectComponent.getName();
            let value = objectComponent.getValue();
            Reflect.set(this.getTarget(), name, value);
        }

        set(target: Object, property: string, value: any): boolean {
            console.debug("ObjectHandler.set", target, property, value);
            Reflect.set(target, property, value);
            this.notifyObservers(new Event(this,{}));
            return true;
        }
    }
}
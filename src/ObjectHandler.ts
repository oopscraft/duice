///<reference path="Handler.ts"/>

namespace duice {

    /**
     * ObjectHandler
     */
    export class ObjectHandler extends Handler<Object> {

        /**
         * constructor
         * @param object
         */
        constructor(object: Object) {
            super(object);
        }

        update(objectComponent: ObjectComponent): void {
            console.debug('ObjectHandler.update', objectComponent);
            let name = objectComponent.getName();
            let value = objectComponent.getValue();
            Reflect.set(this.getTarget(), name, value);
        }

        set(target: Object, property: string, value: any): boolean {
            console.debug("ObjectHandler.set", target, property, value);
            Reflect.set(target, property, value);
            this.notifyObservers();
            return true;
        }
    }
}
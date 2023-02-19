///<reference path="Handler.ts"/>

namespace duice {

    export class ObjectHandler extends Handler<Object> {

        constructor(target: object) {
            super(target);
        }

        update(objectComponent: ObjectComponent): void {
            console.log("Set.update", objectComponent);
            let name = objectComponent.getName();
            let value = objectComponent.getValue();
            Reflect.set(this.getTarget(), name, value);
        }

        set(target: Object, property: string, value: any): boolean {
            console.log("ArrayHandler.change", target, property, value);
            Reflect.set(target, property, value);
            this.notifyObservers();
            return true;
        }
    }
}
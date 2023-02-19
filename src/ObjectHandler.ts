///<reference path="Handler.ts"/>

namespace duice {

    export class ObjectHandler extends Handler<Object> {

        constructor(target: object) {
            super(target);
        }

        update(observable: ObjectComponent): void {
            console.log("Set.update", observable);
        }

        set(target: Object, property: string, value: any): boolean {
            console.log("ArrayHandler.change", target, property, value);
            this.notifyObservers();
            return true;
        }
    }
}
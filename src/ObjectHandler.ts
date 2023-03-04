///<reference path="Handler.ts"/>
namespace duice {

    export class ObjectHandler extends Handler<object> {

        constructor(target: object){
            super(target);
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


        doUpdate(element: duice.Element<object>, detail): void {
            // TODO
        }

    }

}
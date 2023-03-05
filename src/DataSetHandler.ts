///<reference path="Handler.ts"/>
namespace duice {

    export class ArrayHandler extends Handler<object[]> {

        constructor(target: object[]) {
            super(target);
        }

        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: object, property: string, value: any): boolean {
            console.log("- Array.set", target, property, value);
            Reflect.set(target, property, value);
            if(property === 'length'){
                this.notifyObservers({});
            }
            return true;
        }

        doUpdate(element: duice.Element<object[]>, detail): void {
            // TODO
        }


    }

}
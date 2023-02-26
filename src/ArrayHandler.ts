///<reference path="Handler.ts"/>
namespace duice {

    /**
     * ArrayHandler
     */
    export class ArrayHandler extends Handler<object[]> {

        /**
         * constructor
         * @param target
         */
        constructor(array: object[]) {
            super(array);
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
                this.notifyComponents({});
            }
            return true;
        }

        /**
         * update
         * @param component
         * @param detail
         */
        update(component: ArrayComponent, detail: object): void {
            console.debug("ArrayHandler.update:", component, detail);
        }

    }
}
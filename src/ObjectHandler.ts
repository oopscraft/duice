namespace duice {

    export class ObjectHandler implements ProxyHandler<Object> {

        target: Object;

        constructor(target:Object) {
            this.target = target;
            globalThis.Object.defineProperty(target, "_handler_", {
                value: this,
                writable: false
            });
        }

        get(target: object, property: string, receiver: object): any {
            console.log("- Object.get", target, property, receiver);
            return Reflect.get(target, property, receiver);
        }

        set(target: object, property: string, value: any) {
            console.log("- Object.set", target, property, value);
            Reflect.set(target, property, value);
            return true;
        }

        /**
         * fromJson
         * @param json
         */
        fromJson(json: object): void {
            globalThis.Object.assign(json, this.target);
        }

    }

}
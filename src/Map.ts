namespace duice {

    /**
     * Object
     */
    export class Map extends globalThis.Map {

        /**
         * constructor
         * @param json
         */
        constructor(json: object) {
            super();
            return new Proxy(this, {


            });
            // Object.assign(this, json);
            //
            // // adds handler
            // let handler = new ObjectHandler(this);
            // Object.defineProperty(this, "_handler_", {
            //     value: handler,
            //     writable: false
            // });

            // // return proxy
            // return new Proxy(this, {
            //     set(target: Object, property: string, value: any): boolean {
            //         console.debug("ObjectHandler.set", target, property, value);
            //         handler.set(property, value);
            //         return true;
            //     }
            // });
        }

        fromJson(json: object): void {

        }

    }

}
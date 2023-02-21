namespace duice {

    /**
     * Object
     */
    export class Object extends globalThis.Object {

        /**
         * constructor
         * @param json
         */
        constructor(json: object) {
            super();
            Object.assign(this, json);

            // adds handler
            let handler = new ObjectHandler(this);
            Object.defineProperty(this, "_handler_", {
                value: handler,
                writable: false
            });

            // return proxy
            return new Proxy(this, {
                set(target: Object, property: string, value: any): boolean {
                    console.debug("ObjectHandler.set", target, property, value);
                    handler.set(property, value);
                    return true;
                }
            });
        }

    }

}
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
            return new Proxy(this, new ObjectHandler(this));
        }

    }

}
namespace duice {

   export class Object extends globalThis.Object {

        /**
         * constructor
         * @param json
         */
        constructor(json: object) {
            super();
            return new Proxy(this, new ObjectHandler(this)handler);
        }

    }

}
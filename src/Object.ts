namespace duice {

   export class Object {

        /**
         * constructor
         * @param json
         */
        constructor(object: object) {
            return new Proxy(object, new ObjectHandler(object));
        }

    }

}
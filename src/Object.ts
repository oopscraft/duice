namespace duice {

    export class Object {

        /**
         * create
         * @param json
         */
        static create(json: object): any {
            let object = new Object(json);
            let handler = new ObjectHandler(object);
            return new Proxy(object, handler);
        }

        /**
         * constructor
         * @param json
         */
        private constructor(json: object) {
            for(let property in json){
                let value = json[property];
                this[property] = value;
            }
        }

    }
}
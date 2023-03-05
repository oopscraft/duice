namespace duice {

    export class Data extends globalThis.Object {

        /**
         * create
         * @param json
         */
        static create(json: object): any {
            let object = new Data(json);
            let handler = new DataHandler(object);
            return new Proxy(object, handler);
        }

        /**
         * constructor
         * @param json
         */
        private constructor(json: object) {
            super();
            for(let property in json){
                let value = json[property];
                this[property] = value;
            }
        }

    }
}
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
        constructor(json: object) {
            this.fromJson(json);
        }

        fromJson(json: object): void {
            for(let property in json){
                let value = json[property];
                this[property] = value;
            }
        }

    }

}
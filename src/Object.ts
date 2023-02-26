namespace duice {

    export class Object {

        /**
         * constructor
         * @param json
         */
        constructor(json: object) {
            this.fromJson(json);
        }

        fromJson(json: object): void {
            for(let property in json){
                this[property] = json[property];
            }
        }

    }

}
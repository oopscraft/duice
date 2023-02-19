namespace duice {

    export class Object extends globalThis.Object {

        constructor(json: object) {
            super();
            Object.assign(this, json);
            return new Proxy(this, new ObjectHandler(this));
        }

    }

}
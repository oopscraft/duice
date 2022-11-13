namespace duice {

    export class ObjectProxy {

        constructor(target: object) {
            return new Proxy(target, new ObjectHandler(target));
        }

    }

}
namespace duice {

    export interface Observer {

        update(observable: object, detail: any): void;

    }
}
namespace duice {

    export interface Observer {

        update(observable: object, event: event.Event): void;

    }
}
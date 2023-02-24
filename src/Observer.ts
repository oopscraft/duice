namespace duice {

    /**
     * Observer
     */
    export interface Observer {

        update(observable: Observable, detail: object): void;

    }

}
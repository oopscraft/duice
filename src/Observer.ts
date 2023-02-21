namespace duice {

    /**
     * Observer
     */
    export interface Observer {

        update(observable: Observable, event: Event): void;

    }

}
namespace duice {

    /**
     * Observer
     */
    export interface Observer {

        update(observable: Observable, event: duice.event.Event): void;

    }

}
namespace duice {

    /**
     * Observer
     */
    export interface Observer {

        doUpdate(observable: Observable, event: Event): void;

    }

}
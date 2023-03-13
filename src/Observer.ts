namespace duice {

    /**
     * Observer
     */
    export interface Observer {

        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: object, event: Event): void;

    }
}
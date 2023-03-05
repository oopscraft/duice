namespace duice {

    /**
     * Observer
     */
    export interface Observer {

        /**
         * update
         * @param observable
         * @param detail
         */
        update(observable: object, detail: any): void;

    }
}
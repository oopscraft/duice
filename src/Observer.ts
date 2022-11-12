namespace duice {

    /**
     * Observer
     */
    export interface Observer<T> {

        /**
         * update
         * @param observable
         */
        update(observable: T): void;

    }

}
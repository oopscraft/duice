namespace duice {

    /**
     * Observable
     */
    export interface Observable<T> {

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: T): void;

        /**
         * notifyObservers
         */
        notifyObservers(): void;

    }

}
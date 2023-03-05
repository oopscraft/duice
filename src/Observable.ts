namespace duice {

    /**
     * Observable
     */
    export class Observable {

        observers: Observer[] = []

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: Observer): void {
            this.observers.push(observer);
        }

        /**
         * notifyObservers
         * @param detail
         */
        notifyObservers(detail: any): void {
            this.observers.forEach(observer => {
                observer.update(this, detail);
            });
        }

    }

}
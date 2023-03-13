namespace duice {

    /**
     * Observable
     */
    export class Observable {

        observers: Observer[] = []

        notifyEnabled: boolean = true;

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: Observer): void {
            this.observers.push(observer);
        }

        /**
         * removeObserver
         * @param observer
         */
        removeObserver(observer: Observer): void {
            for(let i = 0, size = this.observers.length; i < size; i++){
                if(this.observers[i] === observer){
                    this.observers.splice(i,1);
                    return;
                }
            }
        }

        /**
         * suspend notify
         */
        suspendNotify(): void {
            this.notifyEnabled = false;
        }

        /**
         * resume notify
         * @param enable
         */
        resumeNotify(): void {
            this.notifyEnabled = true;
        }

        /**
         * notifyObservers
         * @param event
         */
        notifyObservers(event: Event): void {
            if(this.notifyEnabled){
                this.observers.forEach(observer => {
                    observer.update(this, event);
                });
            }
        }

    }

}
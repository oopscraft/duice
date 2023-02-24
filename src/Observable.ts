namespace duice {

    export class Observable {

        observers: Observer[] = [];

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
         * notifyObservers
         * @param event
         */
        notifyObservers(detail: object): void {
            this.observers.forEach(observer => {
                observer.update(this, event);
            });
        }
    }

}
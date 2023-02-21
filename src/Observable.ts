namespace duice {

    export class Observable {

        observers: Observer[] = [];

        addObserver(observer: Observer): void {
            this.observers.push(observer);
        }

        notifyObservers(event: duice.event.Event): void {
            this.observers.forEach(observer => {
                observer.update(this, event);
            });
        }
    }

}
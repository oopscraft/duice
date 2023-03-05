namespace duice {

    export class Observable {

       observers: Observer[] = []

       addObserver(observer: Observer): void {
           this.observers.push(observer);
       }

       notifyObservers(detail: any): void {
           this.observers.forEach(observer => {
                observer.update(this, detail);
           });
       }

    }

}
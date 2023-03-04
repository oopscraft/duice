namespace duice {

    export class Observable {

       observers: Observer<any>[] = []

       addObserver(observer: Observer<any>): void {
           this.observers.push(observer);
       }

       notifyObservers(detail: any): void {
           this.observers.forEach(observer => {
                observer.update(this, detail);
           });
       }

    }

}
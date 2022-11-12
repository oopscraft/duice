namespace duice {

    export interface Observable<T> {

        addObserver(observer: T): void;

        notifyObservers(): void;

    }

}
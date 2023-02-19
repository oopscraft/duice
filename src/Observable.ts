namespace duice {

    export interface Observable {

        addObserver(observer: Observer): void;

        notifyObservers(): void;
    }

}
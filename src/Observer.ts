namespace duice {

    export interface Observer<T> {

        update(observable: T): void;

    }

}
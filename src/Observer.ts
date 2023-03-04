namespace duice {

    export interface Observer<T> {

        update(observable: T, detail: any): void;

    }
}
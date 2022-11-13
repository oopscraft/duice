
namespace duice {

    /**
     * Set data structure
     */
    export class ArrayHandler implements ProxyHandler<object[]>, Observer<ArrayComponent>, Observable<ArrayComponent> {

        target: object[];

        observers: Array<ArrayComponent> = new Array<ArrayComponent>();

        /**
         * constructor
         * @param target
         */
        constructor(target: object[]) {
            this.target = target;
        }

        /**
         * getTarget
         */
        getTarget(): object[] {
           return this.target;
        }

        getOwnPropertyDescriptor(target, prop) {
            if(prop == "[[handler]]"){
                return { configurable: true, enumerable: true, value: this };
            }
            return undefined;
        }

        set(target: Object, property: string, value: any): boolean {
            console.log("ArrayHandler.change", target, property, value);
            //this.notifyObservers();
            return true;
        }

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: ArrayComponent): void {
            this.observers.push(observer);
        }

        /**
         * notifyObservers
         */
        notifyObservers(): void {
            this.observers.forEach(observer => {
                observer.update(this);
            });
        }

        /**
         * update
         * @param observable
         */
        update(observable: ArrayComponent): void {
            console.log("Set.update", observable);
        }

    }
}
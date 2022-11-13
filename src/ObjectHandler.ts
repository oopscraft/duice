/// <reference path="ObjectComponent.ts" />
namespace duice {

    /**
     * ObjectHandler
     */
    export class ObjectHandler implements ProxyHandler<object>, Observer<ObjectComponent>, Observable<ObjectComponent> {

        target: object;

        observers: Array<ObjectComponent> = new Array<ObjectComponent>();

        constructor(target: object) {
            this.target = target;
        }

        getTarget(): object {
            return this.target;
        }

        getOwnPropertyDescriptor(target, prop) {
            if(prop == "[[handler]]"){
                return { configurable: true, enumerable: true, value: this };
            }
            return undefined;
        }

        set(target: Object, property: string, value: any): boolean {
            console.log("ObjectHandler.change", target, property, value);
            this.target[property] = value;
            this.notifyObservers();
            return false;
        }

        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: ObjectComponent): void {
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
        update(observable: ObjectComponent): void {
            console.log("ObjectHandler.update", observable);
            let property = observable.getProperty();
            let value = observable.getValue();
            this.target[property] = value;
        }

    }

}

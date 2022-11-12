///<reference path="SetElement.ts"/>
///<reference path="Map.ts"/>

namespace duice {

    export class Set extends window.Set<Map> implements Observer<SetComponent>, Observable<SetComponent> {

        observers: Array<SetComponent> = new Array<SetComponent>();

        // @ts-ignore
        add(map:Map): void {
            super.add(map);
            //this.notifyChange();
        }

        addObserver(observer: SetComponent): void {
            this.observers.push(observer);
        }

        notifyObservers(): void {
            this.observers.forEach(observer => {
                observer.update(this);
            });
        }

        update(observable: SetComponent): void {
            console.log("Set.update", observable);
        }

    }
}
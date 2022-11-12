namespace duice {

    export class SetComponent implements Observer<Set>, Observable<Set> {

        element: SetElement;

        set: Set;

        item: string;

        observers: Array<Set> = new Array<Set>();

        constructor(element: SetElement) {
            this.element = element;
            console.log("SetComponent.constructor", element);
        }

        initialize(context: object): void {
            console.log("SetComponent.initialize", context);
            this.set = findObject(context, this.element.getAttribute(`${getAlias()}-set`));
            this.item = this.element.getAttribute(`${getAlias()}-item`);
            this.element.setAttribute(`${getAlias()}-id`, generateUuid());
            this.addObserver(this.set);
            this.set.addObserver(this);
            this.update(this.set);
            let _this = this;
        }

        addObserver(observer: Set): void {
            this.observers.push(observer);
        }

        notifyObservers(): void {
            this.observers.forEach(observer => {
                observer.update(this);
            })
        }

        update(observable: Set): void {
            this.element.update(observable);
        }

    }

}
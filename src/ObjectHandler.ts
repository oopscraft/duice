///<reference path="Observable.ts"/>
///<reference path="Observer.ts"/>
///<reference path="DataHandler.ts"/>
///<reference path="event/PropertyChangeEvent.ts"/>
namespace duice {

    export class ObjectHandler extends DataHandler<object> {

        propertyChangingListener: Function;

        propertyChangedListener: Function;

        constructor() {
            super();
        }

        get(target: object, property: string, receiver: object): any {
            return Reflect.get(target, property, receiver);
        }

        set(target: object, property: string, value: any) {

            // change value
            Reflect.set(target, property, value);

            // notify
            let event = new duice.event.PropertyChangeEvent(this, property, value);
            this.notifyObservers(event);

            // returns
            return true;
        }

        async update(observable: Observable, event: event.Event): Promise<void> {
            console.debug("ObjectHandler.update", observable, event);

            // Element
            if (observable instanceof ObjectElement) {
                let property = observable.getProperty();
                let value = observable.getValue();
                if(await this.checkListener(this.propertyChangingListener, event)){
                    this.setValue(property, value);
                    await this.checkListener(this.propertyChangedListener, event);
                }
            }

            // notify
            this.notifyObservers(event);
        }

        getValue(property: string): any {
            property = property.replace('.','?.');
            return new Function(`return this.${property};`).call(this.getTarget());
        }

        setValue(property: string, value: any): void {
            new Function('value', `this.${property} = value;`).call(this.getTarget(), value);
        }

        focus(property: string) {
            this.observers.forEach(observer => {
                if(observer instanceof ObjectElement) {
                    if(observer.getProperty() === property) {
                        if(observer.focus()) {
                            return false;
                        }
                    }
                }
            });
        }

    }

}
///<reference path="Observable.ts"/>
///<reference path="Observer.ts"/>
///<reference path="DataHandler.ts"/>
///<reference path="event/PropertyChangeEvent.ts"/>
namespace duice {

    /**
     * object handler class
     */
    export class ObjectHandler extends DataHandler<ObjectProxy> {

        propertyChangingListener: Function;

        propertyChangedListener: Function;

        /**
         * constructor
         */
        constructor() {
            super();
        }

        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target: object, property: string, receiver: object): any {
            console.debug("ObjectHandler.get", target, property, receiver);
            return Reflect.get(target, property, receiver);
        }

        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: object, property: string, value: any) {
            console.debug("ObjectHandler.set", target, property, value);

            // change value
            Reflect.set(target, property, value);

            // notify
            let event = new duice.event.PropertyChangeEvent(this, property, value);
            this.notifyObservers(event);

            // returns
            return true;
        }

        /**
         * update
         * @param observable
         * @param event
         */
        async update(observable: Observable, event: event.Event): Promise<void> {
            console.debug("ObjectHandler.update", observable, event);

            // Element
            if(observable instanceof ObjectElement){
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

        /**
         * getValue
         * @param property
         */
        getValue(property: string): any {
            property = property.replace('.','?.');
            return new Function(`return this.${property};`).call(this.getTarget());
        }

        /**
         * setValue
         * @param property
         * @param value
         */
        setValue(property: string, value: any): void {
            new Function('value', `this.${property} = value;`).call(this.getTarget(), value);
        }

    }

}
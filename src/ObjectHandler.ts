///<reference path="Observable.ts"/>
///<reference path="Observer.ts"/>
namespace duice {

    /**
     * ObjectHandler
     */
    export class ObjectHandler extends Handler<ObjectProxy> {

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
            let event = new PropertyChangeEvent(this, property, value);
            this.notifyObservers(event);

            // returns
            return true;
        }

        /**
         * update
         * @param observable
         * @param event
         */
        async update(observable: Observable, event: Event): Promise<void> {
            console.log("ObjectHandler.update", observable, event);

            // Element
            if(observable instanceof Element){
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













        // originObject: object;
        //
        // propertyChangingListener: Function;
        //
        // propertyChangedListener: Function;
        //
        // /**
        //  * assign
        //  * @param object
        //  */
        // assign(object: object): void {
        //     try {
        //         // suspend
        //         this.suspendListener()
        //         this.suspendNotify();
        //
        //         // deletes
        //         for (let property in this.getTarget()) {
        //             delete this.getTarget()[property];
        //         }
        //
        //         // assign
        //         for (let property in object) {
        //             this.getTarget()[property] = object[property];
        //         }
        //
        //         // saves origin object
        //         this.save();
        //     } finally {
        //         // resume
        //         this.resumeListener();
        //         this.resumeNotify();
        //     }
        //
        //     // notify observers
        //     this.notifyObservers(new Event(this));
        // }
        //
        // /**
        //  * update
        //  * @param element
        //  * @param event
        //  */
        // async update(element: Element<any>, event: Event): Promise<void> {
        //     console.log("ObjectHandler.update", element, event);
        //
        //     // if property change event
        //     if(event instanceof PropertyChangeEvent){
        //         let property = element.getProperty();
        //         let value = element.getValue();
        //         if(await this.checkListener(this.propertyChangingListener, event)){
        //             this.setValue(property, value);
        //             await this.checkListener(this.propertyChangedListener, event);
        //         }
        //     }
        //
        //     // notify
        //     this.notifyObservers(event);
        // }
        //
        // /**
        //  * save
        //  */
        // save(): void {
        //     this.originObject = JSON.parse(JSON.stringify(this.getTarget()));
        // }
        //
        // /**
        //  * reset
        //  */
        // reset(): void {
        //     this.assign(this.originObject);
        // }
        //
        // /**
        //  * isDirty
        //  */
        // isDirty(): boolean {
        //     return JSON.stringify(this.getTarget()) !== JSON.stringify(this.originObject);
        // }
        //
        // /**
        //  * getValue
        //  * @param property
        //  */
        // getValue(property: string): any {
        //     property = property.replace('.','?.');
        //     return new Function(`return this.${property};`).call(this.getTarget());
        // }
        //
        // /**
        //  * setValue
        //  * @param property
        //  * @param value
        //  */
        // setValue(property: string, value: any): void {
        //     new Function('value', `this.${property} = value;`).call(this.getTarget(), value);
        // }
        //
        // /**
        //  * sets property changing event listener
        //  * @param listener
        //  */
        // setPropertyChangingListener(listener: Function): void {
        //     this.propertyChangingListener = listener;
        // }
        //
        // /**
        //  * sets property changed event listener
        //  * @param listener
        //  */
        // setPropertyChangedListener(listener: Function): void {
        //     this.propertyChangedListener = listener;
        // }

    }

}
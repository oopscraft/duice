///<reference path="Observable.ts"/>
namespace duice {

    /**
     * ArrayHandler
     */
    export class ArrayHandler extends Observable implements Observer {

        arrayProxy: ArrayProxy;

        readonlyAll: boolean = false;

        readonly: Set<string> = new Set<string>();

        listenerEnabled: boolean = true;

        propertyChangingListener: Function;

        propertyChangedListener: Function;

        rowAddingListener: Function;

        rowAddedListener: Function;

        rowDeletingListener: Function;

        rowDeletedListener: Function;

        rowMovingListener: Function;

        rowMovedListener: Function;

        /**
         * constructor
         * @param arrayProxy
         */
        constructor(arrayProxy: ArrayProxy) {
            super();
            this.arrayProxy = arrayProxy;

            // setting handler as property
            globalThis.Object.defineProperty(arrayProxy, '_handler_', {
                value: this,
                writable: true
            });

            // creates child object to proxy
            for(let index = 0; index < this.arrayProxy.length; index ++) {
                let objectProxy = new ObjectProxy(this.arrayProxy[index]);
                this.arrayProxy[index] = objectProxy;
                let objectHandler = ObjectProxy.getHandler(objectProxy);
                objectHandler.addObserver(this);
            }
        }

        /**
         * getArrayProxy
         */
        getArrayProxy(): ArrayProxy {
            return this.arrayProxy;
        }

        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target: object, property: string, receiver: object): any {
            console.log("ArrayHandler.get", '|', target, '|', property, '|', receiver);
            let _this = this;
            const value = target[property];
            if (typeof value === 'function') {
                if (['push', 'unshift'].includes(property)) {
                    return function (el) {
                        console.log('this is a array modification');
                        let result = Array.prototype[property].apply(target, arguments);
                        _this.notifyObservers(new Event(_this));
                        return result;
                    }
                }
                if (['pop'].includes(property)) {
                    return function () {
                        console.log('this is a array modification');
                        let result = Array.prototype[property].apply(target, arguments);
                        _this.notifyObservers(new Event(this));
                        return result;
                    }
                }
                return value.bind(target);
            }
            return value;
        }

        // /**
        //  * set
        //  * @param target
        //  * @param property
        //  * @param value
        //  */
        // set(target: object, property: string, value: any): boolean {
        //     console.log("ArrayHandler.set", '|', target, '|', property, '|', value);
        //     Reflect.set(target, property, value);
        //     if(property === 'length'){
        //         this.notifyObservers(new Event(this));
        //     }
        //     return true;
        // }

        /**
         * assign
         * @param array
         */
        assign(array: object[]): void {
            try {
                // suspend
                this.suspendNotify();

                // deletes
                this.arrayProxy.length = 0;

                // assign
                for(let index = 0, size = array.length; index < size; index ++){
                    let objectProxy = new duice.ObjectProxy(array[index]);
                    this.arrayProxy[index] = objectProxy;
                    let objectHandler = ObjectProxy.getHandler(objectProxy);
                    objectHandler.setPropertyChangingListener(this.propertyChangingListener);
                    objectHandler.setPropertyChangedListener(this.propertyChangedListener);
                    objectHandler.addObserver(this);
                }

            }finally{
                // resume
                this.resumeNotify();
            }

            // notify observers
            this.notifyObservers(new Event(this));
        }

        /**
         * update
         * @param elementSet
         * @param event
         */
        async update(elementSet: ElementSet<any>, event: Event): Promise<void> {
            console.log("DataSetHandler", elementSet, event);

            // RowModeEvent
            if(event instanceof RowMoveEvent){
                let object = this.arrayProxy.splice(event.getFromIndex(),1)[0];
                this.arrayProxy.splice(event.getToIndex(), 0, object);
            }

            // notify observers
            this.notifyObservers(event);
        }

        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly: boolean): void {
            this.readonlyAll = readonly;
        }

        /**
         * setReadonly
         * @param property
         * @param readonly
         */
        setReadonly(property: string, readonly: boolean): void {
            if(readonly){
                this.readonly.add(property);
            }else{
                this.readonly.delete(property);
            }
        }

        /**
         * isReadonly
         * @param property
         */
        isReadonly(property: string): boolean {
            return this.readonlyAll || this.readonly.has(property);
        }

        /**
         * suspends listener
         */
        suspendListener(): void {
            this.listenerEnabled = false;
        }

        /**
         * resumes listener
         */
        resumeListener(): void {
            this.listenerEnabled = true;
        }

        /**
         * checkListener
         * @param listener
         * @param event
         */
        async checkListener(listener: Function, event: Event): Promise<boolean> {
            if(this.listenerEnabled){
                let result = await listener.call(this.getArrayProxy(), event);
                if(result == false){
                    return false;
                }
            }
            return true;
        }

        /**
         * set property changing event listener
         * @param listener
         */
        setPropertyChangingListener(listener: Function): void {
            this.propertyChangingListener = listener;
            this.arrayProxy.forEach(object => {
                ObjectProxy.onPropertyChanging(object, listener);
            });
        }

        /**
         * set property changed event listener
         * @param listener
         */
        setPropertyChangedListener(listener: Function): void {
            this.propertyChangedListener = listener;
            this.arrayProxy.forEach(object => {
                ObjectProxy.onPropertyChanged(object, listener);
            });
        }

        /**
         * setRowAddingListener
         * @param listener
         */
        setRowAddingListener(listener: Function): void {
            this.rowAddingListener = listener;
        }

        /**
         * setRowAddedListener
         * @param listener
         */
        setRowAddedListener(listener: Function): void {
            this.rowAddedListener = listener;
        }

        /**
         * setRowDeletingListener
         * @param listener
         */
        setRowDeletingListener(listener: Function): void {
            this.rowDeletingListener = listener;
        }

        /**
         * setRowDeletedListener
         * @param listener
         */
        setRowDeletedListener(listener: Function): void {
            this.rowDeletedListener = listener;
        }

        /**
         * setRowMovingListener
         * @param listener
         */
        setRowMovingListener(listener: Function): void {
            this.rowMovingListener = listener;
        }

        /**
         * setRowMovedListener
         * @param listener
         */
        setRowMovedListener(listener: Function): void {
            this.rowMovedListener = listener;
        }

    }

}
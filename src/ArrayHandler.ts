///<reference path="Handler.ts"/>
namespace duice {

    /**
     * ArrayHandler
     */
    export class ArrayHandler extends Handler<ArrayProxy> {

        propertyChangingListener: Function;

        propertyChangedListener: Function;

        /**
         * constructor
         * @param arrayProxy
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
            console.debug("ArrayHandler.get", '|', target, '|', property, '|', receiver);
            let _this = this;
            const value = target[property];
            if (typeof value === 'function') {

                // push, unshift
                if (['push', 'unshift'].includes(property)) {
                    return async function () {
                        let index;
                        if (property === 'push') {
                            index = receiver['length'];
                        } else if (property === 'unshift') {
                            index = 0;
                        }
                        let rows = [];
                        for (let i in arguments) {
                            rows.push(arguments[i]);
                        }
                        //await _this.insertRow(index, ...rows);
                        return _this.target.length;
                    }
                }

                // splice
                if (['splice'].includes(property)) {
                    // TODO
                }

                // pop, shift
                if (['pop', 'shift'].includes(property)) {
                    return async function () {
                        let index;
                        if (property === 'pop') {
                            index = receiver['length'] - 1;
                        } else if (property === 'shift') {
                            index = 0;
                        }
                        let rows = [target[index]];
                        //await _this.deleteRow(index);
                        return rows;
                    }
                }

                // bind
                return value.bind(target);
            }

            // return
            return value;
        }


        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: object, property: string, value: any): boolean {
            console.debug("ArrayHandler.set", '|', target, '|', property, '|', value);
            Reflect.set(target, property, value);
            if (property === 'length') {
                this.notifyObservers(new Event(this));
            }
            return true;
        }

        /**
         * update
         * @param elementSet
         * @param event
         */
        async update(observable: Observable, event: Event): Promise<void> {
            console.debug("ArrayHandler.update", observable, event);

            // ElementSet
            if(observable instanceof ElementSet){
                if (event instanceof RowMoveEvent) {
                    let object = this.getTarget().splice(event.getFromIndex(), 1)[0];
                    this.getTarget().splice(event.getToIndex(), 0, object);
                }
            }

            // notify observers
            this.notifyObservers(event);
        }




















        //     propertyChangingListener: Function;
        //
        //     propertyChangedListener: Function;
        //
        //     rowInsertingListener: Function;
        //
        //     rowInsertedListener: Function;
        //
        //     rowDeletingListener: Function;
        //
        //     rowDeletedListener: Function;
        //
        //
        //
        //
        //     /**
        //      * assign
        //      * @param array
        //      */
        //     assign(array: object[]): void {
        //         try {
        //             // suspend
        //             this.suspendNotify();
        //
        //             // deletes
        //             this.getTarget().length = 0;
        //
        //             // assign
        //             for(let index = 0, size = array.length; index < size; index ++){
        //                 let objectProxy = new duice.ObjectProxy(array[index]);
        //                 this.getTarget()[index] = objectProxy;
        //                 let objectHandler = ObjectProxy.getHandler(objectProxy);
        //                 objectHandler.setPropertyChangingListener(this.propertyChangingListener);
        //                 objectHandler.setPropertyChangedListener(this.propertyChangedListener);
        //                 objectHandler.addObserver(this);
        //             }
        //
        //         }finally{
        //             // resume
        //             this.resumeNotify();
        //         }
        //
        //         // notify observers
        //         this.notifyObservers(new Event(this));
        //     }
        //
        //     /**
        //      * insertRow
        //      * @param index
        //      * @param rows
        //      */
        //     async insertRow(index: number, ...rows: object[]): Promise<void> {
        //         let event = new RowInsertEvent(this, index, rows);
        //         if(await this.checkListener(this.rowInsertingListener, event)){
        //             this.getTarget().splice(index, 0, ...rows);
        //             await this.checkListener(this.rowInsertedListener, event);
        //             this.notifyObservers(event);
        //         }
        //     }
        //
        //     /**
        //      * deleteRow
        //      * @param index
        //      * @param size
        //      */
        //     async deleteRow(index: number, size?: number): Promise<void> {
        //         let sliceBegin = index;
        //         let sliceEnd = (size ? index + size : index + 1);
        //         let rows = this.getTarget().slice(sliceBegin, sliceEnd);
        //         let event = new RowDeleteEvent(this, index, rows);
        //         if(await this.checkListener(this.rowDeletingListener, event)){
        //             let spliceStart = index;
        //             let spliceDeleteCount = (size ? size : 1);
        //             this.getTarget().splice(spliceStart, spliceDeleteCount);
        //             await this.checkListener(this.rowDeletedListener, event);
        //             this.notifyObservers(event);
        //         }
        //     }
        //
        //     /**
        //      * appendRow
        //      * @param rows
        //      */
        //     async appendRow(...rows: object[]): Promise<void> {
        //         let index = this.getTarget().length;
        //         return this.insertRow(index, ...rows);
        //     }
        //
        //     /**
        //      * update
        //      * @param elementSet
        //      * @param event
        //      */
        //     async update(elementSet: ElementSet<any>, event: Event): Promise<void> {
        //         console.log("DataSetHandler", elementSet, event);
        //
        //         // RowModeEvent
        //         if(event instanceof RowMoveEvent){
        //             let object = this.getTarget().splice(event.getFromIndex(),1)[0];
        //             this.getTarget().splice(event.getToIndex(), 0, object);
        //         }
        //
        //         // notify observers
        //         this.notifyObservers(event);
        //     }
        //
        //     /**
        //      * set property changing event listener
        //      * @param listener
        //      */
        //     setPropertyChangingListener(listener: Function): void {
        //         this.propertyChangingListener = listener;
        //         this.getTarget().forEach(objectProxy => {
        //             ObjectProxy.getHandler(objectProxy).setPropertyChangingListener(listener);
        //         });
        //     }
        //
        //     /**
        //      * set property changed event listener
        //      * @param listener
        //      */
        //     setPropertyChangedListener(listener: Function): void {
        //         this.propertyChangedListener = listener;
        //         this.getTarget().forEach(objectProxy => {
        //             ObjectProxy.getHandler(objectProxy).setPropertyChangedListener(listener);
        //         });
        //     }
        //
        //     /**
        //      * setRowInsertingListener
        //      * @param listener
        //      */
        //     setRowInsertingListener(listener: Function): void {
        //         this.rowInsertingListener = listener;
        //     }
        //
        //     /**
        //      * setRowInsertedListener
        //      * @param listener
        //      */
        //     setRowInsertedListener(listener: Function): void {
        //         this.rowInsertedListener = listener;
        //     }
        //
        //     /**
        //      * setRowDeletingListener
        //      * @param listener
        //      */
        //     setRowDeletingListener(listener: Function): void {
        //         this.rowDeletingListener = listener;
        //     }
        //
        //     /**
        //      * setRowDeletedListener
        //      * @param listener
        //      */
        //     setRowDeletedListener(listener: Function): void {
        //         this.rowDeletedListener = listener;
        //     }
        //
        // }

    }
}
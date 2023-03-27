///<reference path="DataHandler.ts"/>
///<reference path="event/RowMoveEvent.ts"/>
namespace duice {

    /**
     * array handler class
     */
    export class ArrayHandler extends DataHandler<ArrayProxy> {

        propertyChangingListener: Function;

        propertyChangedListener: Function;

        rowInsertingListener: Function;

        rowInsertedListener: Function;

        rowDeletingListener: Function;

        rowDeletedListener: Function;

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
        get(target: ArrayProxy, property: string, receiver: object): any {
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
                        await target.insertRow(index, ...rows);
                        return _this.target.length;
                    }
                }

                // splice
                if (['splice'].includes(property)) {
                    return async function () {

                        // parse arguments
                        let start = arguments[0];
                        let deleteCount = arguments[1];
                        let deleteRows = [];
                        for (let i = start; i < (start + deleteCount); i++) {
                            deleteRows.push(target[i]);
                        }
                        let insertRows = [];
                        for (let i = 2; i < arguments.length; i++) {
                            insertRows.push(arguments[i]);
                        }

                        // delete rows
                        if(deleteCount > 0) {
                            await target.deleteRow(start, deleteCount);
                        }

                        // insert rows
                        if(insertRows.length > 0){
                            await target.insertRow(start, ...insertRows);
                        }

                        // returns deleted rows
                        return deleteRows;
                    }
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
                        await target.deleteRow(index);
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
        set(target: ArrayProxy, property: string, value: any): boolean {
            console.debug("ArrayHandler.set", '|', target, '|', property, '|', value);
            Reflect.set(target, property, value);
            if (property === 'length') {
                this.notifyObservers(new event.Event(this));
            }
            return true;
        }

        /**
         * update
         * @param observable
         * @param event
         */
        async update(observable: Observable, event: event.Event): Promise<void> {
            console.debug("ArrayHandler.update", observable, event);

            // instance is array component
            if(observable instanceof ArrayComponent){
                if (event instanceof duice.event.RowMoveEvent) {
                    let object = this.getTarget().splice(event.getFromIndex(), 1)[0];
                    this.getTarget().splice(event.getToIndex(), 0, object);
                }
            }

            // notify observers
            this.notifyObservers(event);
        }

    }

}
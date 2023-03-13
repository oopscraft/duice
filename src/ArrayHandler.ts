///<reference path="Observable.ts"/>
///<reference path="Observer.ts"/>
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

        rowInsertingListener: Function;

        rowInsertedListener: Function;

        rowDeletingListener: Function;

        rowDeletedListener: Function;

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
                let objectHandler = getHandler(objectProxy);
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

                // insert element at last,end
                if (['push', 'unshift'].includes(property)) {
                    return async function() {

                        // creates row insert event
                        let index = -1;
                        if(property === 'push'){
                            index = receiver['length'];
                        }else if(property == 'unshift'){
                            index = 0;
                        }
                        let rows = [];
                        for(let i in arguments){
                            rows.push(arguments[i]);
                        }
                        let event = new RowInsertEvent(_this, index, rows);
                        console.debug("RowInsertEvent", event);

                        // calls RowInsertingListener
                        let length = -1;
                        if(await _this.checkListener(_this.rowInsertingListener, event)) {

                            // apply
                            length = Array.prototype[property].apply(target, arguments);

                            // call RowInsertedListener
                            await _this.checkListener(_this.rowInsertedListener, event);

                            // notify observer
                            _this.notifyObservers(event);
                        }

                        // returns
                        return length;
                    }
                }

                // insert element at position
                if(['splice'].includes(property)){
                    return async function() {

                        // parse arguments
                        let start = arguments[0];
                        let deleteCount = arguments[1];
                        let deleteRows = [];
                        for(let i = start; i < (start + deleteCount); i ++) {
                            deleteRows.push(target[i]);
                        }
                        let insertRows = [];
                        for(let i = 2; i < arguments.length; i ++) {
                            insertRows.push(arguments[i]);
                        }

                        // delete rows
                        if(deleteCount > 0){
                            let rowDeleteEvent = new RowDeleteEvent(_this, start, deleteRows);
                            if(await _this.checkListener(_this.rowDeletingListener, rowDeleteEvent)){

                            }

                        }



                        let result = Array.prototype[property].apply(target, arguments);
                        _this.notifyObservers(new Event(_this));
                        return result;
                    }
                }

                // removes last,first element
                if (['pop', 'shift'].includes(property)) {
                    return async function() {

                        // creates row delete event
                        let index = -1;
                        if(property === 'pop'){
                            index = receiver['length']-1;
                        }else if(property === 'shift'){
                            index = 0;
                        }
                        let rows = [target[index]];
                        let event = new RowDeleteEvent(_this, index, rows);
                        console.debug("RowDeleteEvent", event);

                        // call RowDeletingListener
                        let deletedRows;
                        if(await _this.checkListener(_this.rowDeletingListener, event)){

                            // apply
                            deletedRows = Array.prototype[property].apply(target, arguments);

                            // call RowDeletedListener
                            await _this.checkListener(_this.rowDeletedListener, event);

                            // notify observers
                            _this.notifyObservers(event);
                        }

                        // return
                        return deletedRows
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
            console.log("ArrayHandler.set", '|', target, '|', property, '|', value);
            Reflect.set(target, property, value);
            if(property === 'length'){
                this.notifyObservers(new Event(this));
            }
            return true;
        }

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
                    let objectHandler = getHandler(objectProxy);
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

        async insertRow(index: number, ...rows: object[]): Promise<void> {
            let event = new RowInsertEvent(this, index, rows);
            if(await this.checkListener(this.rowInsertingListener, event)){
                this.arrayProxy.splice(index, 0, ...rows);
                await this.checkListener(this.rowInsertedListener, event);
                this.notifyObservers(event);
            }
        }

        async deleteRow(index: number, size?: number): Promise<void> {

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
         * set property changing event listener
         * @param listener
         */
        setPropertyChangingListener(listener: Function): void {
            this.propertyChangingListener = listener;
            this.arrayProxy.forEach(objectProxy => {
                getHandler(objectProxy).setPropertyChangingListener(listener);
            });
        }

        /**
         * set property changed event listener
         * @param listener
         */
        setPropertyChangedListener(listener: Function): void {
            this.propertyChangedListener = listener;
            this.arrayProxy.forEach(objectProxy => {
                getHandler(objectProxy).setPropertyChangedListener(listener);
            });
        }

        /**
         * setRowInsertingListener
         * @param listener
         */
        setRowInsertingListener(listener: Function): void {
            this.rowInsertingListener = listener;
        }

        /**
         * setRowInsertedListener
         * @param listener
         */
        setRowInsertedListener(listener: Function): void {
            this.rowInsertedListener = listener;
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
            if(this.listenerEnabled && listener){
                let result = await listener.call(this.arrayProxy, event);
                if(result == false){
                    return false;
                }
            }
            return true;
        }

    }

}
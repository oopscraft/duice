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

        beforeChangeListener: Function;

        afterChangeListener: Function;

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
                let object = new ObjectProxy(this.arrayProxy[index]);
                this.arrayProxy[index] = object;
                let objectHandler = ObjectProxy.getHandler(object);
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
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: object, property: string, value: any): boolean {
            console.log("- Array.set", target, property, value);
            Reflect.set(target, property, value);
            if(property === 'length'){
                this.notifyObservers({});
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
                    let objectHandler = ObjectProxy.getHandler(objectProxy);
                    objectHandler.setBeforeChangeListener(this.beforeChangeListener);
                    objectHandler.setAfterChangeListener(this.afterChangeListener);
                    objectHandler.addObserver(this);
                    this.arrayProxy[index] = objectProxy;
                }

            }finally{
                // resume
                this.resumeNotify();
            }

            // notify observers
            this.notifyObservers({});
        }

        /**
         * update
         * @param elementSet
         * @param detail
         */
        update(elementSet: ElementSet<any>, detail: any): void {
            console.log("DataSetHandler", elementSet, detail);
            if(detail.name === 'changeIndex'){
                let data = this.arrayProxy.splice(detail.fromIndex,1)[0];
                this.arrayProxy.splice(detail.toIndex, 0, data);
            }
            this.notifyObservers(detail);
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
         * setBeforeChangeListener
         * @param listener
         */
        setBeforeChangeListener(listener: Function): void {
            this.beforeChangeListener = listener;
        }

        /**
         * setAfterChangeListener
         * @param listener
         */
        setAfterChangeListener(listener: Function): void {
            this.afterChangeListener = listener;
        }

    }

}
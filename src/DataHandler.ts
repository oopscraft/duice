///<Reference path="Observable.ts"/>
///<Reference path="Observer.ts"/>
namespace duice {

    export abstract class DataHandler<T extends DataProxy> extends Observable implements Observer {

        target: T;

        readonlyAll: boolean = false;

        readonly: Set<string> = new Set<string>();

        listenerEnabled: boolean = true;

        /**
         * constructor
         * @protected
         */
        protected constructor() {
            super();
        }

        /**
         * setTarget
         * @param target
         */
        setTarget(target: T): void {
            this.target = target;
        }

        /**
         * getTarget
         */
        getTarget(): T {
            return this.target;
        }

        /**
         * update
         * @param observable
         * @param event
         */
        abstract update(observable: object, event: Event): void;

        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly: boolean): void {
            this.readonlyAll = readonly;
            if(readonly === false){
                this.readonly.clear();
            }
            this.notifyObservers(new Event(this));
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
            this.notifyObservers(new Event(this));
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
            if(this.listenerEnabled && listener){
                let result = await listener.call(this.getTarget(), event);
                if(result == false){
                    return false;
                }
            }
            return true;
        }

    }

}
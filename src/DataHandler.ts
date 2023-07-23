///<Reference path="Observable.ts"/>
///<Reference path="Observer.ts"/>
namespace duice {

    export abstract class DataHandler<T> extends Observable implements Observer {

        target: T;

        readonlyAll: boolean = false;

        readonly: Set<string> = new Set<string>();

        disableAll: boolean = false;

        disable: Set<string> = new Set<string>();

        listenerEnabled: boolean = true;

        protected constructor() {
            super();
        }

        setTarget(target: T): void {
            this.target = target;
        }

        getTarget(): T {
            return this.target;
        }

        abstract update(observable: object, event: event.Event): void;

        setReadonlyAll(readonly: boolean): void {
            this.readonlyAll = readonly;
            if(readonly === false){
                this.readonly.clear();
            }
            this.notifyObservers(new event.Event(this));
        }

        setReadonly(property: string, readonly: boolean): void {
            if(readonly){
                this.readonly.add(property);
            }else{
                this.readonly.delete(property);
            }
            this.notifyObservers(new event.Event(this));
        }

        isReadonly(property: string): boolean {
            return this.readonlyAll || this.readonly.has(property);
        }

        setDisableAll(disable: boolean): void {
            this.disableAll = disable;
            if(disable === false) {
                this.disable.clear();
            }
            this.notifyObservers(new event.Event(this));
        }

        setDisable(property: string, disable: boolean): void {
            if(disable) {
                this.disable.add(property);
            }else{
                this.disable.delete(property);
            }
            this.notifyObservers(new event.Event(this));
        }

        isDisable(property: string): boolean {
            return this.disableAll || this.disable.has(property);
        }

        suspendListener(): void {
            this.listenerEnabled = false;
        }

        resumeListener(): void {
            this.listenerEnabled = true;
        }

        async checkListener(listener: Function, event: event.Event): Promise<boolean> {
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
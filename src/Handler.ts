///<reference path="Observable.ts"/>
namespace duice {

    /**
     * Handler
     */
    export abstract class Handler extends Observable implements Observer {

        target: any;

        /**
         * constructor
         * @param target
         * @protected
         */
        protected constructor(target: any) {
            super();
            this.target = target;
        }

        /**
         * update
         * @param component
         * @param event
         */
        update(component: Component, event: Event): void {
            this.doUpdate(component, event);
        }

        /**
         * doUpdate
         * @param component
         * @param event
         */
        abstract doUpdate(component: Component, event: Event): void;

        /**
         * getTarget
         */
        getTarget(): any {
            return this.target;
        }

        get(target: any, property: any, receiver: any): any {
            return Reflect.get(target, property, receiver);
        }

    }

}

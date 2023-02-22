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
         */
        protected constructor(target: any){
            super();
            this.target = target;
        }

        /**
         * getTarget
         */
        getTarget(): any {
            return this.target();
        }

        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: Event): void {
            this.doUpdate(observable, event);
        }

        /**
         * doUpdate
         * @param component
         * @param event
         */
        abstract doUpdate(component: Observable, event: Event): void;

    }

}
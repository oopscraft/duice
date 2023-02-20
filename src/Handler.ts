///<reference path="Observable.ts"/>
namespace duice {

    /**
     * Handler
     */
    export abstract class Handler extends Observable implements Observer, ProxyHandler<any> {

        target: any;

        /**
         * constructor
         * @param target
         * @protected
         */
        protected constructor(target: any) {
            super();
            this.target = target;

            // adds handler
            Object.defineProperty(target, "_handler_", {
                value: this,
                writable: false
            });
        }

        /**
         * update
         * @param component
         * @param event
         */
        abstract update(component: Component, event: Event): void;

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

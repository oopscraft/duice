///<reference path="Observable.ts"/>
namespace duice {

    export abstract class Handler<T> extends Observable implements Observer<Element<T>> {

        target: T;

        /**
         * constructor
         * @param target
         * @protected
         */
        protected constructor(target: T) {
            super();
            this.target = target;
            globalThis.Object.defineProperty(target, "_handler_", {
                value: this,
                writable: true
            });
        }

        /**
         * getTarget
         */
        getTarget(): T {
            return this.target;
        }

        /**
         * update
         * @param element
         * @param detail
         */
        update(element: Element<T>, detail: any): void {
            this.doUpdate(element, detail);
        }

        /**
         * doUpdate
         * @param element
         * @param detail
         */
        abstract doUpdate(element: Element<T>, detail): void;

    }

}
///<reference path="Observer.ts"/>
///<reference path="Component.ts"/>

namespace duice {

    export abstract class ArrayComponent extends Component<Array> {

        item: string;

        status: string;

        protected constructor(element: HTMLElement, context: object) {
            super(element, context);
            console.log("SetComponent.constructor", element);
            this.item = this.getAttribute("item");
            this.status = this.getAttribute("status");

            // bind
            let array = findObject(context, this.getAttribute("bind"));
            let arrayHandler = getProxyHandler(array);
            arrayHandler.addObserver(this);
        }

        update(arrayHandler: ArrayHandler) {
            console.debug(arguments.callee.toString());
            let array = arrayHandler.getTarget();
            this.setArray(array);
        }

        getItem(): string {
            return this.item;
        }

        getStatus(): string {
            return this.status;
        }

        abstract setArray(array:object[]);

    }

}
///<reference path="Observer.ts"/>
///<reference path="Component.ts"/>

namespace duice {

    /**
     * ArrayComponent
     */
    export abstract class ArrayComponent extends Component<Map> {

        var: string;

        /**
         * constructor
         * @param element
         */
        protected constructor(element: HTMLElement, context: object) {
            super(element, context);
            console.log("SetComponent.constructor", element);
            this.var = this.getAttribute("var");

            // bind
            let array = findObject(context, this.getAttribute("bind"));
            let arrayHandler = getProxyHandler(array);
            arrayHandler.addObserver(this);
        }

        getVar(): string {
            return this.var;
        }

    }

}
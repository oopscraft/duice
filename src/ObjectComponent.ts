///<reference path="Observer.ts"/>
///<reference path="Component.ts"/>
namespace duice {

    /**
     * ObjectComponent
     */
    export abstract class ObjectComponent extends Component {

        name: string;

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement) {
            console.debug("ObjectComponent.constructor", element);
            super(element);
            this.name = this.getAttribute("name");
        }

        /**
         * getName
         */
        getName(): string {
            return this.name;
        }

        /**
         * setValue
         * @param value
         */
        abstract setValue(value: any): void;

        /**
         * getValue
         */
        abstract getValue(): any;

    }

}

///<reference path="Observer.ts"/>
///<reference path="Component.ts"/>
namespace duice {

    /**
     * ObjectComponent
     */
    export abstract class ObjectComponent extends Component<Object> {

        name: string;

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement, context: object) {
            super(element, context);
            console.debug("MapComponent.constructor", element);
            this.name = this.getAttribute("name");

            // bind
            let object = findObject(context, this.getAttribute("bind"));
            this.bind(object._handler_);

            // update
            this.update(object._handler_);
        }

        /**
         * update
         * @param objectHandler
         */
        update(objectHandler: ObjectHandler): void {
            console.debug("ObjectComponent.update", objectHandler);
            let object = objectHandler.getTarget();
            let value = object[this.name];
            this.setValue(value);
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

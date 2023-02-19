///<reference path="Observer.ts"/>
///<reference path="Component.ts"/>

namespace duice {

    export abstract class ObjectComponent extends Component<Map> {

        name: string;

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

        update(objectHandler: ObjectHandler): void {
            let object = objectHandler.getTarget();
            let value = object[this.name];
            this.setValue(value);
        }

        getName(): string {
            return this.name;
        }

        abstract setValue(value: any): void;

        abstract getValue(): any;

        abstract setReadonly(readonly: boolean);



    }

}

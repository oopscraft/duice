///<reference path="../ObjectComponent.ts"/>
namespace duice.element {

    export class Input extends ObjectComponent {

        element: HTMLInputElement;

        /**
         * create
         * @param element
         */
        static create(element: HTMLInputElement): Input {
            let type = element.getAttribute('type');
            switch(type) {
                case 'number':
                    return new InputNumber(element);
                case 'checkbox':
                    return new InputCheckbox(element);
                default:
                    return new Input(element);
            }
        }

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement) {
            super(element);
        }

        /**
         * doInitialize
         * @param object
         */
        override doInitialize(object: object): void {

            // adds change event listener
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyHandlers({});
            },true);

            // update
            this.doUpdate(object, {});
        }

        /**
         * doUpdate
         * @param object
         * @param detail
         */
        override doUpdate(object: object, detail: object): void {
            let value = object[this.property];
            this.element.value = value;
        }

        /**
         * getValue
         */
        override getValue(): any {
            return this.element.value;
        }

    }

    // defines component
    defineComponent(Input, "input", `${getAlias()}-input`);

}


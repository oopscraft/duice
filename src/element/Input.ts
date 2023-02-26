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
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.setValue(this.value);
            },true);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): boolean {
            this.element.value = value;
            this.notifyHandlers({});
            return true;
        }

        /**
         * getValue
         */
        getValue(): any {
            return this.element.value;
        }

    }

    // defines component
    defineComponent(Input, "input", `${getAlias()}-input`);

}


///<reference path="../ObjectComponent.ts"/>
namespace duice.element {

    export class Input extends ObjectComponent {

        element: HTMLInputElement;

        type: string;

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
            this.type = element.getAttribute('type');
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyHandlers({});
            },true);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): boolean {
            this.element.value = value;
            return true;
        }

        /**
         * getValue
         */
        getValue(): any {
            if(this.type === 'number'){
                return Number(this.element.value);
            }
            return this.element.value;
        }

    }

    // defines component
    defineComponent(Input, "input", `${getAlias()}-input`);

}


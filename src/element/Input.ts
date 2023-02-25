///<reference path="../ObjectComponent.ts"/>
namespace duice.element {

    export class Input extends ObjectComponent {

        element: HTMLInputElement;

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
                _this.notifyObservers({});
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
            return this.element.value;
        }

    }

    // defines component
    defineComponent(Input, "input", `${getAlias()}-input`);

}

